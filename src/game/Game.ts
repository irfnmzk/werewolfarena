import LineMessage from 'src/line/LineMessage';
import Player from './base/Player';

export default class Game {
  public readonly groupId: string;

  public players: Player[] = [];
  public status: 'OPEN' | 'PLAYING' = 'OPEN';
  public day: number = 0;
  public time: 'DAY' | 'DAWN' | 'NIGHT' = 'DAY';

  private timer: any;
  private timerDuration = [12000, 3000, 4000, 1000];
  private timerMessage = ['60', '30', '20', '10'];

  private readonly channel: LineMessage;

  constructor(groupId: string, channel: LineMessage) {
    this.groupId = groupId;
    this.channel = channel;

    this.setStartTimer();
  }

  private setStartTimer(run = -1) {
    if (run >= this.timerDuration.length) {
      this.startGame();
      return;
    }
    this.broadcastMessage(this.timerMessage[run]);
    this.timer = setTimeout(() => {
      this.setStartTimer(run + 1);
    }, this.timerDuration[run]);
  }

  private broadcastMessage(message: string) {
    this.channel.sendWithText(this.groupId, message);
  }

  private startGame() {
    this.timer = null;
    this.channel.sendWithText(this.groupId, 'Game Di mulai');
  }
}
