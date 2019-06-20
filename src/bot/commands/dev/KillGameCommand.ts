import MessageSource from '@bot/base/MessageSource';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';

export default class KillGameCommand extends Command {
  constructor(channel: LineMessage) {
    super(channel);

    this.TYPE = ['GROUP'];
    this.TRIGGER = ['/killgame', '/kg', '/reset'];
  }

  /**
   * run
   * Run The Command
   */
  public async run(_: number, source: MessageSource) {
    const { groupId } = source;
    // Refactor this
    if (source.userId !== 'Uba7208b2cee5077db42428da5f40ca2f') return;
    const gameExist = await this.groupManager!.gameExist(groupId!);
    if (!gameExist) {
      this.channel.replyWithText(source.replyToken!, 'Game not existed');
      return;
    }

    this.channel.replyWithText(
      source.replyToken!,
      `Resetting game.. please wait for around ${
        this.groupManager!.get(groupId!)!.game!.gameDuration
      } seconds`
    );
    return this.groupManager!.get(groupId!)!.game!.killGame();
  }
}
