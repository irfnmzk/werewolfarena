import MessageSource from '@bot/base/MessageSource';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';

export default class PlayerListCommand extends Command {
  constructor(channel: LineMessage) {
    super(channel);

    this.TYPE = ['GROUP'];
    this.TRIGGER = ['/pemain', '/players', '/playerlist'];
  }

  /**
   * run
   * Run The Command
   */
  public async run(_: string, source: MessageSource) {
    const { groupId } = source;
    const gameExist = await this.groupManager!.gameExist(groupId!);
    if (!gameExist) {
      this.channel.replyWithText(
        source.replyToken!,
        'Tidak ada game yang berjalan pada group ini!'
      );
      return;
    }
    const playerList = this.groupManager!.get(
      groupId!
    )!.game!.getLobbyPlayers();
    let message = '';
    if (this.groupManager!.get(groupId!)!.game!.status === 'OPEN') {
      message = playerList.reduce((prev, curr, index) => {
        return prev + curr.name + (index !== playerList.length - 1 ? '\n' : '');
      }, 'Player List\n\n');
    } else {
      message = playerList.reduce((prev, curr, index) => {
        return (
          prev +
          curr.name +
          ` - ${curr.role!.dead ? 'Mati' : 'Hidup'}` +
          (index !== playerList.length - 1 ? '\n' : '')
        );
      }, 'Player List\n\n');
    }
    this.groupManager!.get(groupId!)!.game!.broadcastMessage(message);
  }
}
