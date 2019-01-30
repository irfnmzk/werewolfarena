import LineMessage from 'src/line/LineMessage';
import Player from './base/Player';
import GameLoop from './GameLoop';
import DefaultGameMode from './gamemode/DefaultGameMode';
import GameEventQueue from './GameEventQueue';
import * as Types from './roles/base/RoleTypes';
import LocaleService from '../utils/i18n/LocaleService';

export default class Game {
  public readonly groupId: string;

  public players: Player[] = [];
  public status: 'OPEN' | 'PLAYING' = 'OPEN';
  public day: number = 0;
  public time: Types.time;

  public readonly channel: LineMessage;
  public readonly localeService: LocaleService;

  public readonly eventQueue: GameEventQueue;
  private gamemode: DefaultGameMode;

  private timer: any;
  private timerDuration = [5000, 3000, 4000, 1000];
  private timerMessage = ['', '30', '20', '10'];

  private MAX_PLAYER = 12;
  private MIN_PLAYER = 5;

  constructor(groupId: string, channel: LineMessage) {
    this.groupId = groupId;
    this.channel = channel;
    this.gamemode = new DefaultGameMode(this);
    this.eventQueue = new GameEventQueue(this);
    this.localeService = new LocaleService();

    this.time = 'DAY';

    this.setStartTimer();
  }

  /**
   * addplayer
   */

  public addPlayer(player: Player) {
    if (this.players.length >= this.MAX_PLAYER) {
      return this.broadcastMessage(this.localeService.t('game.full'));
    }
    if (this.status !== 'OPEN') {
      return this.broadcastMessage(this.localeService.t('game.already.start'));
    }
    const found =
      this.players.filter(data => data.userId === player.userId).length > 0;
    if (found) {
      return this.broadcastMessage(this.localeService.t('game.already.in'));
    }
    this.players.push(player);
  }

  /**
   * startGame
   */
  public startGame() {
    this.timer = null;
    this.status = 'PLAYING';
    this.channel.sendWithText(this.groupId, this.localeService.t('game.start'));

    GameLoop(this).then(() => this.endGame());
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
    this.gamemode.assignRoles(this.players);
  }

  /**
   * firstDayScene
   * called when game first run
   */
  public firstDayScene() {
    this.prepareForQueue('DAY');
    this.broadcastMessage(this.localeService.t('game.scene.first'));
    this.players
      .filter(({ role }) => !role!.dead)
      .forEach(player => {
        player.role!.eventDay();
      });
  }

  /**
   * dayScene
   */
  public dayScene() {
    this.prepareForQueue('DAY');
    this.broadcastMessage(this.localeService.t('game.scene.day'));
    this.players
      .filter(({ role }) => !role!.dead)
      .forEach(player => {
        player.role!.eventDay();
      });
  }

  /**
   * nightScene
   */
  public nightScene() {
    this.prepareForQueue('NIGHT');
    this.broadcastMessage(this.localeService.t('game.scene.night'));
    this.players
      .filter(({ role }) => !role!.dead)
      .forEach(player => {
        player.role!.eventNight();
      });
  }

  /**
   * duskScene
   */
  public duskScene() {
    this.prepareForQueue('DUSK');
    this.broadcastMessage(this.localeService.t('game.scene.dusk'));
    this.players
      .filter(({ role }) => !role!.dead)
      .forEach(player => {
        player.role!.eventDusk();
      });
  }

  /**
   * sceneWillEnd
   * called in the end of each scene
   */
  public sceneWillEnd() {
    this.runEventQueue();

    this.sendDyingMessage();
  }

  /**
   * addDay
   * increment the day
   */
  public addDay() {
    this.day += 1;
  }

  /**
   * prepareForQueue
   * called everytime when scene is changing
   */
  public prepareForQueue(time: Types.time) {
    this.time = time;
    this.players.forEach(player => (player.role!.doneAction = false));
    this.eventQueue.refreshQueue(time);
  }

  /**
   * runEventQueue
   */
  public runEventQueue() {
    this.players
      .filter(player => !player.role!.dead)
      .forEach(player => player.role!.timeUp(this.time));

    this.eventQueue.execute();
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
   * processCallback
   * process callback from postback
   */
  public processCallback(event: Types.GameEvent, userId: string) {
    if (this.status === 'OPEN') return;
    this.players
      .filter(player => player.userId === userId)[0]
      .role!.eventCallback(this.time, event);
  }

  /**
   * getTargetPlayer
   */
  public getTargetPlayer(userId: string) {
    return this.players.filter(player => player.userId === userId)[0];
  }

  public broadcastMessage(message: string) {
    this.channel.sendWithText(this.groupId, message);
  }

  private sendDyingMessage() {
    const deathMessage: string[] = [];
    const allDeath = this.eventQueue.getAllDeath();
    allDeath.forEach(death => {
      deathMessage.push(
        this.localeService.t(`death.${death.event}`, {
          player: death.player.name
        })
      );
    });
    if (deathMessage.length === 0) return;
    const message = deathMessage.join('\n');
    this.broadcastMessage(message);
  }

  private endGame() {
    console.log(this.localeService.t('game.end'));
  }

  private setStartTimer(run = 0) {
    if (run >= this.timerDuration.length) {
      this.startGame();
      return;
    }
    if (run !== 0) this.broadcastMessage(this.timerMessage[run]);
    this.timer = setTimeout(() => {
      this.setStartTimer(run + 1);
    }, this.timerDuration[run]);
  }
}
