import Emitter from 'eventemitter3';
import _ from 'lodash';
import Timer from 'easytimer.js';
import { RateLimiterMemory } from 'rate-limiter-flexible';

import GroupManager from '../manager/GroupManager';

import Player from './base/Player';
import GameLoop from './GameLoop';
import DefaultGameMode from './gamemode/DefaultGameMode';
import GameEventQueue from './GameEventQueue';
import * as Types from './roles/base/RoleTypes';
import LocaleService from '../utils/i18n/LocaleService';
import ILineMessage from 'src/line/base/ILineMessage';
// import TestGameMode from './gamemode/TestGameMode';
import MessageGenerator from './roles/helper/MessageGenerator';
import { Message } from '@line/bot-sdk';
import GameOptions from './base/GameOptions';
import GameMode from './gamemode/base/GameMode';
import UserManager from '@manager/UserManager';
import PlayerStats from 'src/utils/db/models/PlayerStats';

export type Winner = 'VILLAGER' | 'WEREWOLF' | 'TANNER' | 'LOVER';

export default class Game {
  public readonly groupId: string;

  public players: Player[] = [];
  public status: 'OPEN' | 'PLAYING' | 'FINISH' | 'KILLED' = 'OPEN';
  public day: number = 0;
  public time: Types.time;

  public winner?: Winner;

  public gameDuration: number; // seconds

  public readonly channel: ILineMessage;
  public readonly localeService: LocaleService;

  public emitter: Emitter;

  public maxVoteMiss = 3;
  public extendedTime = 0;

  public readonly eventQueue: GameEventQueue;

  public readonly debug: boolean;
  public option: GameOptions;

  public playerListInterval: any;
  public gamemode: GameMode;

  private readonly gameLoop: GameLoop;

  private timer: Timer;
  private waitDuration: number = 2; // minute

  private readonly messageGenerator: MessageGenerator;

  private groupManager?: GroupManager;
  private userManager?: UserManager;
  private limiter: RateLimiterMemory;

  constructor(
    groupId: string,
    channel: ILineMessage,
    options: GameOptions,
    groupManager?: GroupManager,
    userManager?: UserManager,
    debug: boolean = false
  ) {
    this.option = options;
    this.userManager = userManager;
    this.groupManager = groupManager;

    this.emitter = new Emitter();
    this.eventQueue = new GameEventQueue(this);
    this.gameLoop = new GameLoop(this);
    this.localeService = new LocaleService();
    this.gamemode = new DefaultGameMode(this);

    this.debug = debug;
    if (this.debug) {
      this.debugMode();
    }

    this.groupId = groupId;
    this.channel = channel;

    this.gameDuration = this.option.duration;
    this.time = 'FIRST'; // todo

    this.messageGenerator = new MessageGenerator(this.localeService, this);

    this.timer = new Timer();
    this.limiter = new RateLimiterMemory({ duration: 10, points: 1 });

    this.setStartTimer();
    this.broadcastGameCreated();
    this.broadcastPlayerListInterval();
  }

  /**
   * broadcastGameCreated
   */
  public broadcastGameCreated() {
    const message: Message[] = [
      this.messageGenerator.joinMessage(),
      this.messageGenerator.getDefaultText(
        '📣 Bila pesan tidak muncul, pastikan kamu sudah update LINE ke versi terbaru!'
      )
    ];
    this.channel.sendMultipleTypeMessage(this.groupId, message);
  }

  /**
   * addplayer
   */

  public addPlayer(player: Player) {
    if (this.players.length >= this.gamemode.MAX_PLAYER!) {
      return this.limiter
        .consume(this.groupId)
        .then(() =>
          this.channel.sendWithText(
            this.groupId,
            this.localeService.t('game.full', {
              max: this.gamemode.MAX_PLAYER!
            })
          )
        )
        .catch(() => true);
    }
    if (this.status !== 'OPEN') {
      return this.limiter
        .consume(this.groupId)
        .then(() =>
          this.channel.sendWithText(
            this.groupId,
            this.localeService.t('game.already.start')
          )
        );
    }
    const found =
      this.players.filter(data => data.userId === player.userId).length > 0;
    if (found) {
      return this.limiter
        .consume(player.userId)
        .then(() =>
          this.channel.sendWithText(
            this.groupId,
            this.localeService.t('game.already.in', { name: player.name })
          )
        )
        .catch(() => true);
    }
    this.players.push(player);

    this.channel.sendWithText(
      this.groupId,
      this.localeService.t('game.join', {
        player: player.name
      })
    );
  }

  /**
   * startGame
   */
  public startGame() {
    clearInterval(this.playerListInterval);
    if (this.players.length < this.gamemode.MIN_PLAYER!) {
      this.broadcastTextMessage(
        this.localeService.t('game.not_enough', {
          min: this.gamemode.MIN_PLAYER!
        })
      );
      return this.deleteGame();
    }
    this.broadcastTextMessage(this.localeService.t('game.start'));
    this.timer.stop();
    this.status = 'PLAYING';

    this.startGameLoop();
  }

  /**
   * forceStartGame
   */
  public forceStartGame() {
    if (this.status !== 'OPEN') return;
    if (this.players.length >= this.gamemode.MIN_PLAYER!) {
      this.timer.stop();
      return this.startGame();
    }

    return this.broadcastTextMessage(
      this.localeService.t('game.not_enough_force', {
        min: this.gamemode.MIN_PLAYER!
      })
    );
  }

  /**
   * cancleGame
   */
  public cancelGame() {
    if (this.status !== 'OPEN') {
      return this.broadcastTextMessage(
        this.localeService.t('game.cant_cancel')
      );
    }
    clearInterval(this.playerListInterval);
    this.timer.stop();
    this.broadcastTextMessage(this.localeService.t('game.canceled'));
    return this.deleteGame();
  }

  /**
   * roleBroadcast
   * Broadcast role info to all players
   */
  public broadcastRole() {
    this.players.forEach(player => {
      player.role!.eventAnnouncement();
    });
  }

  /**
   * assignRole
   */
  public assignRole() {
    this.broadcastTextMessage(this.localeService.t('game.role.generating'));
    this.gamemode.assignRoles(this.players);
  }

  /**
   * firstDayScene
   * called when game first run
   */
  public firstDayScene() {
    if (this.isGameKilled()) return;
    this.getAlivePlayer().forEach(player => player.role!.firstDayEvent());
    return this.sendBroadcastSceneMessage('FIRST');
  }

  /**
   * dayScene
   */
  public dayScene() {
    if (this.isGameKilled() || this.status === 'FINISH') return;

    this.broadcastScene('DAY');
    this.prepareForQueue('DAY');

    this.players
      .filter(({ role }) => !role!.dead)
      .forEach(player => {
        player.role!.eventDay();
      });

    return this.waitTillEndOfDay();
  }

  /**
   * nightScene
   */
  public nightScene() {
    if (this.isGameKilled() || this.status === 'FINISH') return;

    this.broadcastScene('NIGHT');
    this.prepareForQueue('NIGHT');

    this.players
      .filter(({ role }) => !role!.dead)
      .forEach(player => {
        player.role!.eventNight();
      });

    return this.waitTillEndOfDay();
  }

  /**
   * duskScene
   */
  public duskScene() {
    if (this.isGameKilled() || this.status === 'FINISH') return;

    this.broadcastScene('DUSK');
    this.prepareForQueue('DUSK');

    this.players
      .filter(({ role }) => !role!.dead)
      .forEach(player => {
        player.role!.eventDusk();
      });

    return this.waitTillEndOfDay();
  }

  /**
   * broadcastScene
   */
  public broadcastScene(scene: Types.time) {
    if (this.eventDeathCount() >= 1) {
      const message = this.getDyingMessage();

      return this.channel.sendMultipleTypeMessage(this.groupId, [
        this.messageGenerator.getBasicFlexMessage(
          this.localeService.t('game.info'),
          message
        ),
        this.messageGenerator.getBasicFlexMessage(
          this.localeService.t(
            `game.scene.header.${scene.toLocaleLowerCase()}`
          ),
          this.localeService.t(`game.scene.${scene.toLocaleLowerCase()}`, {
            time: this.gameDuration,
            day: this.day
          })
        )
      ]);
    }
    // Send no one dying on vote message
    if (scene === 'NIGHT' && this.day !== 0) {
      return this.channel.sendMultipleTypeMessage(this.groupId, [
        this.messageGenerator.getBasicFlexMessage(
          this.localeService.t('game.info'),
          this.localeService.t('vote.no_death')
        ),
        this.messageGenerator.getBasicFlexMessage(
          this.localeService.t(
            `game.scene.header.${scene.toLocaleLowerCase()}`
          ),
          this.localeService.t(`game.scene.${scene.toLocaleLowerCase()}`, {
            time: this.gameDuration,
            day: this.day
          })
        )
      ]);
    }
    if (scene === 'DAY' && this.day !== 0) {
      return this.channel.sendMultipleTypeMessage(this.groupId, [
        this.messageGenerator.getBasicFlexMessage(
          this.localeService.t('game.info'),
          this.localeService.t('night.no_death')
        ),
        this.messageGenerator.getBasicFlexMessage(
          this.localeService.t(
            `game.scene.header.${scene.toLocaleLowerCase()}`
          ),
          this.localeService.t(`game.scene.${scene.toLocaleLowerCase()}`, {
            time: this.gameDuration,
            day: this.day
          })
        )
      ]);
    }
    return this.sendBroadcastSceneMessage(scene);
  }

  /**
   * sceneWillEnd
   * called in the end of each scene
   */
  public sceneWillEnd() {
    this.runEventQueue();
    this.checkEndGame();
  }

  /**
   * runEventQueue
   */
  public runEventQueue() {
    this.players
      .filter(player => !player.role!.dead && !player.role!.doneAction)
      .forEach(player => player.role!.timeUp(this.time));

    this.eventQueue.execute();
  }

  /**
   * addDay
   * increment the day
   */
  public addDay() {
    this.day += 1;
    this.players.forEach(player => player.role!.updateBuff());
  }

  /**
   * prepareForQueue
   * called everytime when scene is changing
   */
  public prepareForQueue(time: Types.time) {
    this.time = time;
    this.players.forEach(player => {
      player.role!.doneAction = false;
    });
    this.eventQueue.refreshQueue(time);

    // For development only
    if (this.debug) {
      this.emitter.emit('scene', time, this.day, this.players);
    }
  }

  /**
   * getEnemyList
   */
  public getEnemyList(player: Player) {
    return this.players.filter(
      target =>
        !target.role!.dead &&
        player.userId !== target.userId &&
        target.role!.id !== player.role!.id
    );
  }

  /**
   * getVoteList
   * get all Alive Player
   */
  public getVoteList(player: Player) {
    return this.players.filter(
      target => !target.role!.dead && player.userId !== target.userId
    );
  }

  /**
   * getAllyList
   * get all alive ally player
   */
  public getAllyList(player: Player) {
    return this.players.filter(
      target =>
        target.role!.id === player.role!.id &&
        !target.role!.dead &&
        player.userId !== target.userId
    );
  }

  /**
   * getTeamList
   */
  public getTeamList(player: Player) {
    return this.players.filter(
      target =>
        target.role!.team === player.role!.team &&
        !target.role!.dead &&
        target.userId !== player.userId
    );
  }

  /**
   * getLobbyPlayers
   */
  public getLobbyPlayers() {
    return this.players;
  }

  /**
   * getLobbyPlayersListMessage
   */
  public getLobbyPlayersListMessage() {
    return this.localeService.t('common.playerlist.header').concat(
      this.getLobbyPlayers()
        .map((player, index) => `${index + 1}. ${player.name}`)
        .join('\n')
    );
  }

  /**
   * getAllDeadPlayers
   */
  public getAllDeadPlayers(player: Player) {
    return this.players.filter(
      target => target.role!.dead && player.userId !== target.userId
    );
  }

  /**
   * getAllPlayer
   */
  public getAllPlayer() {
    return this.players;
  }

  /**
   * processCallback
   * process callback from postback
   */
  public processCallback(event: Types.GameEvent, userId: string) {
    if (!this.isValidCallback(event)) return;

    this.players
      .filter(player => player.userId === userId)[0]
      .role!.eventCallback(this.time, event);
  }

  /**
   * transformPlayerRole
   */
  public transformPlayerRole(player: Player, newRole: Types.RoleId) {
    const oldRole = player.role!.id;
    const roleHistory = player.role!.roleHistory;
    roleHistory.push(newRole);
    player.role = this.gamemode.getNewRole(newRole, this, player);
    player.role!.roleHistory = roleHistory;
    this.channel.sendWithText(
      player.userId,
      this.localeService.t(`role.${oldRole}.transform.${newRole}`)
    );
  }

  /**
   * getTargetPlayer
   */
  public getTargetPlayer(userId: string): Player {
    return this.players.filter(player => player.userId === userId)[0];
  }

  public broadcastMessage(message: string): Promise<any> {
    return this.channel.sendFlexBasicMessage(
      this.groupId,
      this.localeService.t('game.info'),
      message
    );
  }

  /**
   * broadcastTextMessage
   */
  public broadcastTextMessage(message: string) {
    return this.channel.sendWithText(this.groupId, message);
  }

  /**
   * sendLobbyPlayerList
   */
  public sendLobbyPlayerList() {
    this.broadcastTextMessage(this.getLobbyPlayersListMessage());
  }

  /**
   * sendGamePlayerList
   */
  public sendGamePlayerList() {
    this.channel.sendMultipleTypeMessage(this.groupId, [
      this.messageGenerator.getPlayerlistMessage(this.sortedPlayerByDead())
    ]);
  }

  /**
   * isFinish
   */
  public isFinish() {
    const alive = this.calculateAliveTeam(this.players);
    // const role = this.calculateAliveRole();
    // Check Lover for winning
    if (
      alive.total === 2 &&
      this.getAlivePlayer().filter(player => player.role!.inLove).length === 2
    ) {
      // if the condition above is true then change all alive player team to lover
      this.winner = 'LOVER';
      this.getAlivePlayer().forEach(player => player.role!.changeTeam('LOVER'));
      return true;
    }

    if (alive.VILLAGER + alive.WEREWOLF === 3 && this.time === 'DAY') {
      return false;
    }
    if (
      alive.WEREWOLF > 0 &&
      alive.WEREWOLF >= Math.floor((alive.VILLAGER + alive.WEREWOLF) / 2)
    ) {
      // Werewolf win
      this.winner = 'WEREWOLF';
      return true;
    }
    if (alive.VILLAGER > 0 && alive.WEREWOLF <= 0) {
      // villager win
      this.winner = 'VILLAGER';
      return true;
    }
    if (this.players.filter(({ role }) => !role!.dead).length <= 0) {
      this.winner = 'VILLAGER';
      return true;
    }
    return false;
  }

  /**
   * extendTimeDuration
   */
  public extendTimeDuration() {
    const { minutes } = this.timer.getTotalTimeValues();
    if (this.waitDuration - minutes >= 10) {
      return;
    }
    this.waitDuration++;
    this.channel.sendMultipleText(this.groupId, [
      this.localeService.t('game.timer.extend'),
      this.localeService.t('game.timer.minutes', {
        time: this.waitDuration - this.timer.getTotalTimeValues().minutes
      })
    ]);
  }

  /**
   * sendNotifyToWaitingList
   */
  public sendNotifyToWaitingList(userId: string) {
    this.channel.sendWithText(
      userId,
      this.localeService.t('common.notify_waiting_list')
    );
  }

  /**
   * killGame
   */
  public killGame() {
    this.status = 'KILLED';
    this.sendStopSignal();
  }

  public getAlivePlayer() {
    return this.players.filter(data => !data.role!.dead);
  }

  /**
   * getAlivePlayerByRole
   */
  public getAlivePlayerByRole(role: Types.RoleId) {
    return this.players.filter(
      data => !data.role!.dead && data.role!.id === role
    );
  }

  public getWinningMessage(player: Player) {
    return player.role!.team === this.winner ? 'Menang' : 'Kalah';
  }

  public broadcastPLayerJoin() {
    this.channel.sendMultipleTypeMessage(this.groupId, [
      this.messageGenerator.playerJoinMessage()
    ]);
  }

  /**
   * waitExtendedTime
   */
  public waitExtendedTime(): Promise<any> {
    if (this.isGameKilled() || this.status === 'FINISH') {
      return new Promise(resolve => resolve());
    }
    if (this.debug) {
      console.log('sleeping for ' + this.extendedTime);
      this.emitter.emit('extend_time', this.time, this.day, this.players);
    }
    return new Promise(resolve =>
      setTimeout(() => {
        this.extendedTime = 0;
        this.checkEndGame();
        resolve();
      }, this.extendedTime * 1000)
    );
  }

  /**
   * extendedTimeAction
   */
  public extendedTimeAction(
    player: Player,
    targetId: string,
    event: Types.EventType
  ) {
    const target = this.findPlayerById(targetId);
    player.role!.action(event, target);
  }

  /**
   * finishGameWithWinner
   */
  public finishGameWithWinner(winner: Winner) {
    this.winner = winner;
    this.finishGame();
  }

  private findPlayerById(id: string) {
    return this.players.filter(player => player.userId === id)[0];
  }

  private isGameKilled() {
    return this.status === 'KILLED';
  }

  private calculateAliveTeam(players: Player[]) {
    // Need to be refactored
    return {
      VILLAGER: players.filter(
        player => !player.role!.dead && player.role!.team === 'VILLAGER'
      ).length,
      WEREWOLF: players.filter(
        player => !player.role!.dead && player.role!.team === 'WEREWOLF'
      ).length,
      total: players.filter(player => !player.role!.dead).length
    };
  }

  private calculateAliveRole() {
    return this.players
      .filter(player => !player.role!.dead)
      .reduce(
        (prev, curr) => {
          prev[curr.role!.id] = (prev[curr.role!.id] || 0) + 1;
          return prev;
        },
        {} as { [key: string]: number }
      );
  }

  private getDyingMessage() {
    const deathMessage: string[] = [];
    const allDeath = this.eventQueue.getAllDeath();
    allDeath.forEach(death => {
      deathMessage.push(
        this.localeService.t(`death.${death.event}`, {
          player:
            this.option.showRole === 'YA'
              ? `${death.player.name}(${death.player.role!.name})`
              : death.player.name,
          killer:
            this.option.showRole === 'YA'
              ? // TODO: show role for killer
                `${death.killer.name}`
              : death.killer.name
        })
      );
    });
    const message = deathMessage.join('\n');
    return message;
  }

  private sortedPlayerByDead() {
    return _.sortBy(this.players, data => !data.role!.dead);
  }

  /**
   * Called when Game is Finished
   */
  private endGame() {
    if (this.status === 'KILLED') {
      this.broadcastTextMessage('Game successfully reseted');
      return this.deleteGame();
    }
    const message = [
      this.messageGenerator.getEndGameMessage(this.sortPlayerByWinning())
    ];
    if (this.eventDeathCount() > 0) {
      const dyingMessage = this.getDyingMessage();
      message.unshift(
        this.messageGenerator.getBasicFlexMessage(
          this.localeService.t('game.info'),
          dyingMessage
        )
      );
    }

    this.channel.sendMultipleTypeMessage(this.groupId, message);
    this.updatePlayerStats();
    if (!this.debug) this.groupManager!.updateStats(this.groupId);

    return this.deleteGame();
  }

  private checkEndGame() {
    if (this.isFinish()) {
      this.finishGame();
    }
  }

  private setStartTimer() {
    this.timer.start();
    this.timer.addEventListener(
      'minutesUpdated',
      this.onTimerMinuteChanged.bind(this)
    );
    this.timer.addEventListener(
      'secondsUpdated',
      this.onTimerSecondChanged.bind(this)
    );
  }

  private onTimerMinuteChanged() {
    const { minutes } = this.timer.getTotalTimeValues();
    const diffrence = this.waitDuration - minutes;
    if (diffrence < 1) return;
    this.channel.sendWithText(
      this.groupId,
      this.localeService.t('game.timer.minutes', { time: diffrence })
    );
  }

  private onTimerSecondChanged() {
    if (this.waitDuration === 0) {
      this.timer.stop();
      return this.startGame();
    }
    const { minutes } = this.timer.getTotalTimeValues();
    const minuteDiffrence = this.waitDuration - minutes;
    if (minuteDiffrence !== 1) return;
    const { seconds } = this.timer.getTimeValues();
    if (seconds === 30) {
      this.channel.sendWithText(
        this.groupId,
        this.localeService.t('game.timer.seconds', { time: 30 })
      );
    } else if (seconds === 45) {
      this.channel.sendWithText(
        this.groupId,
        this.localeService.t('game.timer.seconds', { time: 15 })
      );
    } else if (seconds === 55) {
      this.channel.sendWithText(
        this.groupId,
        this.localeService.t('game.timer.seconds', { time: 5 })
      );
    } else if (seconds === 59) {
      this.timer.stop();
      this.startGame();
    }
  }

  private sendBroadcastSceneMessage(scene: Types.time) {
    this.channel.sendFlexBasicMessage(
      this.groupId,
      this.localeService.t(`game.scene.header.${scene.toLocaleLowerCase()}`),
      this.localeService.t(`game.scene.${scene.toLocaleLowerCase()}`, {
        time: this.gameDuration,
        day: this.day
      })
    );
  }

  private startGameLoop() {
    this.gameLoop.execute().then(() => this.endGame());
  }

  /**
   * Called when any team is Win
   */
  private finishGame() {
    // Send Finish Game here
    this.status = 'FINISH';
    this.sendStopSignal();
  }

  private sendStopSignal() {
    this.emitter.emit('stop');
  }

  private isValidCallback(event: Types.GameEvent) {
    if (this.status === 'OPEN') return false;
    if (Date.now() - event.timeStamp >= 300 * 1000) return false;
    return true;
  }

  private eventDeathCount() {
    return this.eventQueue.death.length;
  }

  private getEndPlayerListMessage() {
    return this.localeService.t('common.playerlist.end_header').concat(
      this.sortPlayerByWinning()
        .map(
          (player, index) =>
            `${index + 1}. ${player.name} - ${this.getRoleHistoryText(
              player
            )} - ${this.getWinningMessage(player)}`
        )
        .join('\n')
    );
  }

  private getRoleHistoryText(player: Player) {
    return player.role!.roleHistory.map(data => data).join(' ➡ ');
  }

  private sortPlayerByWinning() {
    return _.sortBy(this.players, player =>
      this.winner === player.role!.team ? `Menang` : `Kalah`
    );
  }

  private waitTillEndOfDay(): Promise<any> {
    return new Promise(resolve => {
      setTimeout(() => {
        this.sceneWillEnd();
        resolve();
      }, this.gameDuration * 1000);
    });
  }

  private deleteGame() {
    if (this.debug) return;
    this.groupManager!.deletGame(this.groupId);
  }
  private debugMode() {
    console.clear();
    this.gameDuration = 20;
    this.waitDuration = 0;
    this.gamemode = new DefaultGameMode(this);
  }

  private broadcastPlayerListInterval() {
    this.playerListInterval = setInterval(
      () => this.broadcastPLayerJoin(),
      60 * 1000 * 1000
    );
  }

  private updatePlayerStats() {
    this.players.forEach(async player => {
      const data = (await this.userManager!.getPlayerStats(
        player.userId
      )) as PlayerStats;
      const stats: PlayerStats = {
        total_game: data.total_game += 1,
        death: player.role!.dead ? (data.death += 1) : data.death,
        kill: data.kill += player.role!.killCount,
        win: this.winner === player.role!.team ? (data.win += 1) : data.win,
        lose: this.winner !== player.role!.team ? (data.lose += 1) : data.lose
      };
      this.userManager!.updatePlayerStats(player.userId, stats);
    });
  }
}
