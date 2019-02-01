import Command from '../base/Command';
import MessageSource from '@bot/base/MessageSource';
import { BackEvent } from '@game/roles/base/RoleTypes';
import ILineMessage from 'src/line/base/ILineMessage';

export default class GameEventCommand extends Command {
  constructor(channel: ILineMessage) {
    super(channel);

    this.TYPE = ['GROUP'];
    this.TRIGGER = ['GAME_EVENT'];
  }

  public async run(postback: BackEvent, source: MessageSource) {
    const { groupId } = postback.data;
    if (!this.gameManager!.gameExist(groupId)) {
      return;
    }
    this.gameManager!.get(groupId)!.processCallback(
      postback.data,
      source.userId
    );
  }
}
