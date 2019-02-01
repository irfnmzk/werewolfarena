import MessageSource from '@bot/base/MessageSource';
import to from 'await-to-js';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';

export default class JoinGameCommand extends Command {
  constructor(channel: LineMessage) {
    super(channel);

    this.TYPE = ['GROUP'];
    this.TRIGGER = ['/join', '/j'];
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

    const [err, player] = await to(this.channel.getPlayerData(source.userId));
    if (err) {
      return this.channel.replyWithText(
        source.replyToken!,
        'Profile doesnt Exist'
      );
    }
    this.groupManager!.get(groupId!)!.game!.addPlayer(player!);
  }
}
