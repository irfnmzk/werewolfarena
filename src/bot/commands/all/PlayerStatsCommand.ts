import MessageSource from '@bot/base/MessageSource';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';
import { to } from 'await-to-js';

export default class PlayerStatsCommand extends Command {
  constructor(channel: LineMessage) {
    super(channel);

    this.TYPE = ['GROUP', 'USER'];
    this.TRIGGER = ['/playerstats'];
  }

  /**
   * run
   * Run The Command
   */
  public async run(_: number, source: MessageSource) {
    const [err, userData] = await to(
      this.channel.getProfileData(source.userId)
    );
    if (err) return;
    const data = await this.userManager!.getPlayerStats(userData!);
    console.log(data);
  }
}
