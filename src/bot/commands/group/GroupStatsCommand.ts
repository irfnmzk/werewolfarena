import MessageSource from '@bot/base/MessageSource';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';

export default class JoinGameCommand extends Command {
  constructor(channel: LineMessage) {
    super(channel);

    this.TYPE = ['GROUP'];
    this.TRIGGER = ['/stats', '/groupstats', '/gs'];
  }

  /**
   * run
   * Run The Command
   */
  public async run(_: string, source: MessageSource) {
    const { groupId } = source;

    const stats = await this.groupManager!.getStats(groupId!);
    const message = `📣 Statistik Grup\n\nTotal game : ${stats.gamePlayed}`;
    return this.channel.replyWithText(source.replyToken!, message);
  }
}
