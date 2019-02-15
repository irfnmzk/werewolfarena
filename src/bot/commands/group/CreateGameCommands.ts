import MessageSource from '@bot/base/MessageSource';
import Game from '../.././../game/Game';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';

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
    if (!groupId) return;
    const gameExist = await this.groupManager!.gameExist(groupId!);
    if (gameExist) {
      this.channel.replyWithText(source.replyToken!, 'Game already Created');
      return;
    }
    const gameSetting = await this.groupManager!.getGroupSetting(groupId!);
    const game = new Game(
      groupId!,
      this.channel,
      gameSetting,
      this.groupManager!
    );

    this.groupManager!.createGame(groupId!, game);
  }
}
