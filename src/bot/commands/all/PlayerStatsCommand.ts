import MessageSource from '@bot/base/MessageSource';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';
import { to } from 'await-to-js';
// import { getPlayerStatsMessage } from './helper/InfoMessageGenerator';

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
    const data = await this.userManager!.getPlayerStats(source.userId);
    const winRate = ((data.win / data.total_game) * 100).toFixed(2);
    const loseRate = ((data.lose / data.total_game) * 100).toFixed(2);
    const killDeath = ((data.kill / (data.kill + data.death)) * 100).toFixed(2);
    const [err, userData] = await to(
      this.channel.getProfileData(source.userId)
    );
    if (err) return;

    const text = `${userData!.displayName} Stats

Total Game : ${data.total_game}
Kill : ${data.kill} (${killDeath}%)
Win : ${data.win} (${winRate}%)
lose : ${data.lose} (${loseRate}%)
    `;
    this.channel.replyWithText(source.replyToken!, text);
  }
}
