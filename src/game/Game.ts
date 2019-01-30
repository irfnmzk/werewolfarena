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
  public time: 'DAY' | 'DAWN' | 'NIGHT' = 'DAY';

  public readonly channel: LineMessage;
  public readonly localeService: LocaleService;
  private gamemode: DefaultGameMode;

  private readonly eventQueue: GameEventQueue;

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
   */
  public roleBroadcast() {
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
  public dayScene(day: number) {
    this.prepareForQueue('DAY');
    this.day = day;
    this.broadcastMessage(this.localeService.t('game.scene.day'));
    this.players
      .filter(({ role }) => !role!.dead)
      .forEach(player => {
        player.role!.eventDay();
      });
    // TODO
  }

  /**
   * nightScene
   */
  public nightScene(day: number) {
    this.prepareForQueue('NIGHT');
    this.day = day;
    this.broadcastMessage(this.localeService.t('game.scene.night'));
    this.players
      .filter(({ role }) => !role!.dead)
      .forEach(player => {
        player.role!.eventNight();
      });
    // TODO
  }

  /**
   * duskScene
   */
  public duskScene(day: number) {
    this.prepareForQueue('DUSK');
    this.day = day;
    this.broadcastMessage(this.localeService.t('game.scene.dusk'));
    this.players
      .filter(({ role }) => !role!.dead)
      .forEach(player => {
        player.role!.eventDusk();
      });
    // TODO
  }

  /**
   * prepareForQueue
   * called everytime when scene is changing
   */
  public prepareForQueue(time: Types.time) {
    this.players.forEach(player => (player.role!.doneAction = false));
    this.eventQueue.refreshQueue(time);
  }

  /**
   * runEventQueue
   */
  public runEventQueue() {
    // Todo
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

  private broadcastMessage(message: string) {
    this.channel.sendWithText(this.groupId, message);
  }
}
