import MessageSource from '@bot/base/MessageSource';
import Game from '../.././../game/Game';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';
import generateFakePlayers from '../helper/GenerateFakePlayer';

export default class CreateGameCommand extends Command {
  constructor(channel: LineMessage) {
    super(channel);

    this.TRIGGER = ['/buat', '/create'];
    this.TYPE = ['GROUP'];
  }

  /**
   * run
   * Run The Command
   */
  public async run(_: string, source: MessageSource) {
    const { groupId } = source;
    const gameExist = await this.groupManager!.gameExist(groupId!);
    if (gameExist) {
      this.channel.replyWithText(source.replyToken!, 'Game already Created');
      return;
    }
    const game = new Game(groupId!, this.channel);

    // For Development only
    const fakePlayers = generateFakePlayers(4);
    fakePlayers.forEach(player => game.addPlayer(player));

    this.groupManager!.createGame(groupId!, game);
  }
}
