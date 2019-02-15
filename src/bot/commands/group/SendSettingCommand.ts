import Command from '../base/Command';
import MessageSource from '@bot/base/MessageSource';
import { BackEvent } from '@game/roles/base/RoleTypes';
import ILineMessage from 'src/line/base/ILineMessage';

export default class SendSettingCommand extends Command {
  constructor(channel: ILineMessage) {
    super(channel);

    this.TYPE = ['POSTBACK'];
    this.TRIGGER = ['GET_GROUP_SETTING'];
  }

  public async run(postback: BackEvent, source: MessageSource) {
    // const { groupId } = postback.data
    console.log('hurray');
  }
}
