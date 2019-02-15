import Command from '../base/Command';
import MessageSource from '@bot/base/MessageSource';
import { BackEvent, GroupSetting } from '@game/roles/base/RoleTypes';
import ILineMessage from 'src/line/base/ILineMessage';
import {
  settingShowRole,
  settingDuration
} from './helper/SettingMessageGenerator';

export default class GetGroupSettingCommand extends Command {
  constructor(channel: ILineMessage) {
    super(channel);

    this.TYPE = ['POSTBACK'];
    this.TRIGGER = ['GET_USER_GROUP_SETTING'];
  }

  public async run(event: BackEvent, source: MessageSource) {
    if (!source.userId) return;
    const setting = event.data as GroupSetting;
    // const profile = await this.channel.getProfileData(source.userId!);
    if (setting.setting === 'SHOWROLE') {
      return this.channel.replyWithAny(
        source.replyToken!,
        settingShowRole(setting.groupId)
      );
    }
    return this.channel.replyWithAny(
      source.replyToken!,
      settingDuration(setting.groupId)
    );
  }
}
