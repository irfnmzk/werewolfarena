import MessageSource from '@bot/base/MessageSource';
import to from 'await-to-js';
import GameManager from '../../../manager/GameManager';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';

export default class JoinGameCommand implements Command {
  public readonly TRIGGER = '/join';
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
      this.channel.replyWithText(source.replyToken!, 'Game not existed');
      return;
    }

    const [err, player] = await to(this.channel.getPlayerData(source.userId));
    if (err) {
      return this.channel.replyWithText(
        source.replyToken!,
        'Profile doesnt Exist'
      );
    }
    this.gameManager.get(groupId!)!.addPlayer(player!);

    return this.channel.replyWithText(
      source.replyToken!,
      'Berhasil Bergabung ke permainn'
    );
  }
}
