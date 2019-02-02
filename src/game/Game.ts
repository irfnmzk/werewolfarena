import Emitter from 'eventemitter3';
import _ from 'lodash';
import Timer from 'easytimer.js';

import Player from './base/Player';
import GameLoop from './GameLoop';
import DefaultGameMode from './gamemode/DefaultGameMode';
import GameEventQueue from './GameEventQueue';
import * as Types from './roles/base/RoleTypes';
import LocaleService from '../utils/i18n/LocaleService';
import ILineMessage from 'src/line/base/ILineMessage';
import TestGameMode from './gamemode/TestGameMode';
import MessageGenerator from './roles/helper/MessageGenerator';
import { Message } from '@line/bot-sdk';

export type Winner = 'VILLAGER' | 'WEREWOLF';

export default class Game {
  public readonly groupId: string;

  public players: Player[] = [];
  public status: 'OPEN' | 'PLAYING' | 'FINISH' = 'OPEN';
  public day: number = 0;
  public time: Types.time;

  public winner?: Winner;

  public gameDuration = 20;

  public readonly channel: ILineMessage;
  public readonly localeService: LocaleService;

  public emitter: Emitter;

  public maxVoteMiss = 3;

  public readonly eventQueue: GameEventQueue;
  private gamemode: DefaultGameMode;

  private readonly gameLoop: GameLoop;

  private timer: Timer;
  private waitDuration: number = 20; // minute

  private readonly messageGenerator: MessageGenerator;

  private readonly debug: boolean;

  constructor(groupId: string, channel: ILineMessage, debug: boolean = false) {
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

    this.time = 'DAY';

    this.messageGenerator = new MessageGenerator(this.localeService, this);

    this.timer = new Timer();

    this.setStartTimer();
    this.broadcastGameCreated();
  }

  /**
   * broadcastGameCreated
   */
  public broadcastGameCreated() {
    const message: Message[] = [
      this.messageGenerator.getDefaultText(
        this.localeService.t('game.created')
      ),
      this.messageGenerator.joinMessage()
    ];
    this.channel.sendMultipleTypeMessage(this.groupId, message);
  }

  /**
   * addplayer
   */

  public addPlayer(player: Player) {
    if (this.players.length >= this.gamemode.MAX_PLAYER!) {
      return this.broadcastMessage(
        this.localeService.t('game.full', { max: this.gamemode.MAX_PLAYER! })
      );
    }
    if (this.status !== 'OPEN') {
      return this.broadcastMessage(this.localeService.t('game.already.start'));
    }
    const found =
      this.players.filter(data => data.userId === player.userId).length > 0;
    if (found) {
      return this.broadcastMessage(this.localeService.t('game.already.in'));
    }
    this.broadcastMessage(
      this.localeService.t('game.join', {
        player: player.name,
        total: this.players.length,
        max: this.gamemode.MAX_PLAYER!
      })
    );
    this.players.push(player);
  }

  /**
   * startGame
   */
  public startGame() {
    this.broadcastMessage(this.localeService.t('game.start'));
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
      // clearTimeout(this.timer);
      return this.startGame();
    }

    return this.broadcastMessage(
      this.localeService.t('game.not_enough', {
        min: this.gamemode.MIN_PLAYER!
      })
    );
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
    this.broadcastMessage(this.localeService.t('game.role.generating'));
    this.gamemode.assignRoles(this.players);
  }

  /**
   * firstDayScene
   * called when game first run
   */
  public firstDayScene() {
    this.broadcastMessage(this.localeService.t('game.scene.first'));
  }

  /**
   * dayScene
   */
  public dayScene() {
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
      if (scene === 'DAY') {
        return this.channel.sendMultipleText(this.groupId, [
          message!,
          this.localeService.t('game.day_count', { day: this.day }),
          this.localeService.t(`game.scene.${scene.toLocaleLowerCase()}`, {
            time: this.gameDuration
          })
        ]);
      }
      return this.channel.sendMultipleText(this.groupId, [
        message!,
        this.localeService.t(`game.scene.${scene.toLocaleLowerCase()}`, {
          time: this.gameDuration
        })
      ]);
    }
    // Send no one dying on vote message
    if (scene === 'NIGHT' && this.day !== 0) {
      return this.channel.sendMultipleText(this.groupId, [
        this.localeService.t('vote.no_death'),
        this.localeService.t(`game.scene.${scene.toLocaleLowerCase()}`, {
          time: this.gameDuration
        })
      ]);
    }
    if (scene === 'DAY' && this.day !== 0) {
      return this.channel.sendMultipleText(this.groupId, [
        this.localeService.t('night.no_death'),
        this.localeService.t('game.scene.day_count', { day: this.day }),
        this.localeService.t(`game.scene.${scene.toLocaleLowerCase()}`, {
          time: this.gameDuration
        })
      ]);
    }
    return this.broadcastMessage(
      this.localeService.t(`game.scene.${scene.toLocaleLowerCase()}`, {
        time: this.gameDuration
      })
    );
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
   * getLobbyPlayers
   */
  public getLobbyPlayers() {
    return this.players;
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
   * getTargetPlayer
   */
  public getTargetPlayer(userId: string): Player {
    return this.players.filter(player => player.userId === userId)[0];
  }

  public broadcastMessage(message: string): Promise<any> {
    return this.channel.sendWithText(this.groupId, message);
  }

  /**
   * isFinish
   */
  public isFinish() {
    const alive = this.calculateAliveTeam(this.players);
    if (alive.VILLAGER + alive.WEREWOLF === 3 && this.time === 'DAY') return;
    if (
      alive.WEREWOLF > 0 &&
      alive.WEREWOLF >= (alive.VILLAGER + alive.WEREWOLF) / 2
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

  private calculateAliveTeam(players: Player[]) {
    // Need to be refactored
    return {
      VILLAGER: players.filter(
        player => !player.role!.dead && player.role!.team === 'VILLAGER'
      ).length,
      WEREWOLF: players.filter(
        player => !player.role!.dead && player.role!.team === 'WEREWOLF'
      ).length
    };
  }

  private getDyingMessage() {
    const deathMessage: string[] = [];
    const allDeath = this.eventQueue.getAllDeath();
    allDeath.forEach(death => {
      deathMessage.push(
        this.localeService.t(`death.${death.event}`, {
          player: death.player.name
        })
      );
    });
    const message = deathMessage.join('\n');
    return message;
  }

  private getAlivePlayer() {
    return this.players.filter(data => !data.role!.dead);
  }

  private sendPlayerList() {
    const message = this.getPlayerList();
    setTimeout(() => this.broadcastMessage(message), 1 * 1000);
  }

  private getPlayerList() {
    return this.sortedPlayerByDead().reduce((prev, curr, index) => {
      return (
        prev +
        curr.name +
        ` - ${curr.role!.dead ? 'Mati' : 'Hidup'}` +
        (index !== this.players.length - 1 ? '\n' : '')
      );
    }, `Pemain yang masih hidup ${this.getAlivePlayer().length}/${this.players.length}\n`);
  }

  private sortedPlayerByDead() {
    return _.sortBy(this.players, data => !data.role!.dead);
  }

  private isPlayerWin(player: Player) {
    return player.role!.team === this.winner!;
  }

  private isVitongTime() {
    return this.time === 'DUSK';
  }

  /**
   * Called when Game is Finished
   */
  private endGame() {
    const message = [
      this.localeService.t('game.win', { team: this.winner as any }),
      this.getEndPlayerListMessage(),
      this.localeService.t('game.end')
    ];

    if (this.eventDeathCount() <= 0) {
      return this.channel.sendMultipleText(this.groupId, message);
    }

    const dyingMessage = this.getDyingMessage();
    message.unshift(dyingMessage);
    return this.channel.sendMultipleText(this.groupId, message);
  }

  private checkEndGame() {
    if (this.isFinish()) {
      console.log('game ending');
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
    this.broadcastMessage(
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
      this.broadcastMessage(
        this.localeService.t('game.timer.seconds', { time: 30 })
      );
    } else if (seconds === 45) {
      this.broadcastMessage(
        this.localeService.t('game.timer.seconds', { time: 15 })
      );
    } else if (seconds === 55) {
      this.broadcastMessage(
        this.localeService.t('game.timer.seconds', { time: 5 })
      );
    } else if (seconds === 59) {
      this.timer.stop();
      this.startGame();
    }
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
    return this.sortPlayerByWinning().reduce((prev, curr, index) => {
      return (
        prev +
        `${curr.name} - ${curr.role!.name} - ${
          this.winner === curr.role!.team ? `Menang` : `Kalah`
        } ${this.players.length - 1 === index ? '' : '\n'}`
      );
    }, `Semua Pemain\n\n`);
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

  private debugMode() {
    console.clear();
    this.gameDuration = 20;
    this.waitDuration = 0;
    this.gamemode = new TestGameMode(this);
  }
}
