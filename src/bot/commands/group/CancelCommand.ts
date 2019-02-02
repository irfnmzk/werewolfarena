import MessageSource from '@bot/base/MessageSource';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';

export default class JoinGameCommand extends Command {
  constructor(channel: LineMessage) {
    super(channel);

    this.TYPE = ['GROUP'];
    this.TRIGGER = ['/cancel', '/batal'];
  }

  /**
   * run
   * Run The Command
   */
  public async run(_: string, source: MessageSource) {
    const { groupId } = source;
    const gameExist = await this.groupManager!.gameExist(groupId!);
    if (!gameExist) {
      this.channel.replyWithText(source.replyToken!, 'Game not existed');
      return;
    }

    this.groupManager!.get(groupId!)!.game!.cancelGame();
  }
}
