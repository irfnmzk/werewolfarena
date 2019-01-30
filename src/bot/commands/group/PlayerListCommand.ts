import MessageSource from '@bot/base/MessageSource';
import GameManager from '../../../manager/GameManager';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';

export default class PlayerListCommand implements Command {
  public readonly TRIGGER = '/playerlist';
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
  public async run(_: string, source: MessageSource) {
    const { groupId } = source;
    if (!this.gameManager.gameExist(groupId!)) {
      this.channel.replyWithText(
        source.replyToken!,
        'Tidak ada game yang berjalan pada group ini!'
      );
      return;
    }

    const playerList = this.gameManager.get(groupId!)!.getLobbyPlayers();
    const message = playerList.reduce((prev, curr, index) => {
      return prev + curr.name + (index !== playerList.length - 1 ? '\n' : '');
    }, 'Player List\n\n');
    this.gameManager.get(groupId!)!.broadcastMessage(message);
  }
}
