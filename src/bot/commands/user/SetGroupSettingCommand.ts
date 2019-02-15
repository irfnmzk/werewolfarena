import Command from '../base/Command';
import MessageSource from '@bot/base/MessageSource';
import { BackEvent, GroupSetting } from '@game/roles/base/RoleTypes';
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
    switch (setting.setting) {
      case 'SHOWROLE':
        this.channel.replyWithText(
          source.replyToken!,
          `Tampilkan role saat mati di rubah menjadi ${
            setting.value ? 'Ya' : 'Tidak'
          }`
        );
        this.channel.sendWithText(
          setting.groupId,
          `📣 Tampilkan role saat mati di rubah menjadi ${
            setting.value ? 'Ya' : 'Tidak'
          } oleh ${profile.displayName}`
        );
        break;
      case 'DURATION':
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
