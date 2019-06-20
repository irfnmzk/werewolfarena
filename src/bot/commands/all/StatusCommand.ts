import MessageSource from '@bot/base/MessageSource';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';

export default class StatusCommand extends Command {
  constructor(channel: LineMessage) {
    super(channel);

    this.TYPE = ['GROUP', 'USER'];
    this.TRIGGER = ['/status'];
  }

  /**
   * run
   * Run The Command
   */
  public async run(_: string, source: MessageSource) {
    const status = this.groupManager!.getStatus();
    const uptime = this.format(process.uptime());
    this.channel.replyWithText(
      source.replyToken!,
      `Current Status \n\nUptime : ${uptime} \nOnline games : ${
        status.onlineGroup
      } \nOnline players : ${status.onlinePlayer}`
    );
  }

  public format(seconds: number) {
    function pad(s: number) {
      return (s < 10 ? '0' : '') + s;
    }
    const hours = Math.floor(seconds / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const second = Math.floor(seconds % 60);

    return pad(hours) + ':' + pad(minutes) + ':' + pad(second);
  }
}
