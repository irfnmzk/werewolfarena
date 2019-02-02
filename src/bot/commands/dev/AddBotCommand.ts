import MessageSource from '@bot/base/MessageSource';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';

import generateFakePlayers from '../helper/GenerateFakePlayer';

export default class JoinGameCommand extends Command {
  constructor(channel: LineMessage) {
    super(channel);

    this.TYPE = ['GROUP'];
    this.TRIGGER = ['/addbot', '/ab'];
  }

  /**
   * run
   * Run The Command
   */
  public async run(count: number, source: MessageSource) {
    const { groupId } = source;
    // Refactor this
    if (source.userId !== 'Uba7208b2cee5077db42428da5f40ca2f') return;
    const gameExist = await this.groupManager!.gameExist(groupId!);
    if (!gameExist) {
      this.channel.replyWithText(source.replyToken!, 'Game not existed');
      return;
    }

    const game = this.groupManager!.get(groupId!)!.game!;

    // For Development only
    const fakePlayers = generateFakePlayers(count);
    fakePlayers.forEach(player => game.addPlayer(player));
  }
}
