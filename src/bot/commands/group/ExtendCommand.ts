import MessageSource from '@bot/base/MessageSource';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';

export default class ExtendCommand extends Command {
  constructor(channel: LineMessage) {
    super(channel);

    this.TYPE = ['GROUP'];
    this.TRIGGER = ['/extend'];
  }

  /**
   * run
   * Run The Command
   */
  public async run(_: string, source: MessageSource) {
    const { groupId } = source;
    if (!groupId) return;
    const gameExist = await this.groupManager!.gameExist(groupId!);
    if (!gameExist) {
      return this.channel.replyWithText(
        source.replyToken!,
        'Tidak ada game yang berjalan pada group ini!'
      );
    }

    this.groupManager!.get(groupId!)!.game!.extendTimeDuration();
  }
}
