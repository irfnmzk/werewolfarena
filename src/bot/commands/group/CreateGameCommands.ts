import MessageSource from '@bot/base/MessageSource';
import Game from '../.././../game/Game';
import GameManager from '../../../manager/GameManager';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';
import generateFakePlayers from '../helper/GenerateFakePlayer';

export default class CreateGameCommand implements Command {
  public readonly TRIGGER = ['/buat', '/create'];
  public readonly TYPE = ['GROUP'];
  public readonly channel: LineMessage;

  public gameManager!: GameManager;

  constructor(channel: LineMessage) {
    this.channel = channel;
  }

  /**
   * prepare
   */
  public prepare(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  /**
   * run
   * Run The Command
   */
  public run(_: string, source: MessageSource) {
    const { groupId } = source;
    if (this.gameManager!.gameExist(groupId!)) {
      this.channel.replyWithText(source.replyToken!, 'Game already Created');
      return;
    }
    this.channel.replyWithText(source.replyToken!, 'Game Created!');
    const game = new Game(groupId!, this.channel);

    // For Development only
    const fakePlayers = generateFakePlayers(4);
    fakePlayers.forEach(player => game.addPlayer(player));

    this.gameManager.createGame(game);
  }
}
