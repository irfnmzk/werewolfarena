import Command from '../base/Command';
import MessageSource from '@bot/base/MessageSource';
import { BackEvent } from '@game/roles/base/RoleTypes';
import ILineMessage from 'src/line/base/ILineMessage';

export default class GameEventCommand extends Command {
  constructor(channel: ILineMessage) {
    super(channel);

    this.TYPE = ['POSTBACK'];
    this.TRIGGER = ['GAME_EVENT'];
  }

  public async run(postback: BackEvent, source: MessageSource) {
    const { groupId } = postback.data!;
    const gameExist = await this.groupManager!.gameExist(groupId!);
    if (!gameExist) {
      return;
    }
    this.groupManager!.get(groupId)!.game!.processCallback(
      postback.data!,
      source.userId
    );
  }
}
