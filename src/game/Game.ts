import LineMessage from 'src/line/LineMessage';
import Player from './base/Player';
import GameLoop from './GameLoop';
import DefaultGameMode from './gamemode/DefaultGameMode';

export default class Game {
  public readonly groupId: string;

  public players: Player[] = [];
  public status: 'OPEN' | 'PLAYING' = 'OPEN';
  public day: number = 0;
  public time: 'DAY' | 'DAWN' | 'NIGHT' = 'DAY';

  public readonly channel: LineMessage;
  private gamemode: DefaultGameMode;

  private timer: any;
  private timerDuration = [12000, 3000, 4000, 1000];
  private timerMessage = ['', '30', '20', '10'];

  private MAX_PLAYER = 12;
  private MIN_PLAYER = 5;

  constructor(groupId: string, channel: LineMessage) {
    this.groupId = groupId;
    this.channel = channel;
    this.gamemode = new DefaultGameMode(this);

    this.setStartTimer();
  }

  /**
   * addplayer
   */

  public addPlayer(player: Player) {
    if (this.players.length >= this.MAX_PLAYER) {
      return this.broadcastMessage('Game Is Full');
    }
    if (this.status !== 'OPEN') {
      return this.broadcastMessage('Game already started');
    }
    const found =
      this.players.filter(data => data.userId === player.userId).length > 0;
    if (found) {
      return this.broadcastMessage('already in');
    }
    this.players.push(player);
  }

  /**
   * startGame
   */
  public startGame() {
    this.timer = null;
    this.status = 'PLAYING';
    this.channel.sendWithText(this.groupId, 'Game Di mulai');

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

  private endGame() {
    console.log('game ended');
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
