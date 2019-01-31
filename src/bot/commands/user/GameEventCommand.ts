import Command from '../base/Command';
import GameManager from '../../../manager/GameManager';
import MessageSource from '@bot/base/MessageSource';
import { BackEvent } from '@game/roles/base/RoleTypes';

export default class GameEventCommand implements Command {
  public readonly TRIGGER = ['GAME_EVENT'];
  public readonly TYPE = ['POSTBACK'];

  public gameManager?: GameManager;

  public prepare(gameManager: GameManager) {
    this.gameManager = gameManager;
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
