import Command from '../base/Command';
import MessageSource from '@bot/base/MessageSource';
import { BackEvent, GroupSetting } from '@game/roles/base/RoleTypes';
import Settings from '../../../utils/db/models/GroupSetting';
import ILineMessage from 'src/line/base/ILineMessage';

export default class SetGroupSettingCommand extends Command {
  constructor(channel: ILineMessage) {
    super(channel);

    this.TYPE = ['POSTBACK'];
    this.TRIGGER = ['SET_GROUP_SETTING'];
  }

  public async run(event: BackEvent, source: MessageSource) {
    if (!source.userId) return;
    const setting = event.data as GroupSetting;
    const profile = await this.channel.getProfileData(source.userId!);
    const currentSetting = (await this.groupManager!.getGroupSetting(
      setting.groupId
    )) as Settings;
    console.log(setting);
    switch (setting.setting) {
      case 'SHOWROLE':
        this.groupManager!.setGroupSetting(setting.groupId, {
          duration: currentSetting.duration,
          showRole: setting.value
        });
        this.channel.replyWithText(
          source.replyToken!,
          `Tampilkan role saat mati di rubah menjadi ${
            setting.value === 'YA' ? 'Ya' : 'Tidak'
          }`
        );
        this.channel.sendWithText(
          setting.groupId,
          `📣 Tampilkan role saat mati di rubah menjadi ${
            setting.value === 'YA' ? 'Ya' : 'Tidak'
          } oleh ${profile.displayName}`
        );
        break;
      case 'DURATION':
        this.groupManager!.setGroupSetting(setting.groupId, {
          duration: setting.value,
          showRole: currentSetting.showRole
        });
        this.channel.replyWithText(
          source.replyToken!,
          `Durasi permainan di ubah menjadi ${setting.value} detik`
        );
        this.channel.sendWithText(
          setting.groupId,
          `📣 Durasi permainan di ubah menjadi ${setting.value} detik oleh ${
            profile.displayName
          }`
        );
        break;
    }
  }
}
