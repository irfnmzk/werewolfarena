import MessageSource from '@bot/base/MessageSource';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';
import Game from '../../../game/Game';

export default class JoinGameCommand extends Command {
  constructor(channel: LineMessage) {
    super(channel);

    this.TYPE = ['GROUP'];
    this.TRIGGER = ['/ct', '/buattest', '/createtest'];
  }

  /**
   * run
   * Run The Command
   */
  public async run(_: any, source: MessageSource) {
    const { groupId } = source;
    // Refactor this
    if (source.userId !== 'Uba7208b2cee5077db42428da5f40ca2f') return;
    const gameExist = await this.groupManager!.gameExist(groupId!);
    if (gameExist) {
      this.channel.replyWithText(source.replyToken!, 'Game already created');
      return;
    }

    const game = new Game(
      groupId!,
      this.channel,
      { duration: 30, showRole: true },
      this.groupManager!
    );
    game.gameDuration = 10;
    game.maxVoteMiss = 1;
    this.groupManager!.createGame(groupId!, game);
  }
}
