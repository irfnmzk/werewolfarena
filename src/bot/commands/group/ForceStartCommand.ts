import MessageSource from '@bot/base/MessageSource';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';

export default class JoinGameCommand extends Command {
  constructor(channel: LineMessage) {
    super(channel);

    this.TYPE = ['GROUP'];
    this.TRIGGER = ['/mulai', '/start'];
  }

  /**
   * run
   * Run The Command
   */
  public async run(_: string, source: MessageSource) {
    const { groupId } = source;
    if (!this.gameManager!.gameExist(groupId!)) {
      this.channel.replyWithText(source.replyToken!, 'Game not existed');
      return;
    }

    this.gameManager!.get(groupId!)!.forceStartGame();
  }
}
