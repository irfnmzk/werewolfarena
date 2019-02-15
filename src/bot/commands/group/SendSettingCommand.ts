import Command from '../base/Command';
import MessageSource from '@bot/base/MessageSource';
import { BackEvent } from '@game/roles/base/RoleTypes';
import ILineMessage from 'src/line/base/ILineMessage';
import { getGroupSettingMessage } from './helper/SettingMessageGenerator';

export default class SendSettingCommand extends Command {
  constructor(channel: ILineMessage) {
    super(channel);

    this.TYPE = ['POSTBACK'];
    this.TRIGGER = ['GET_GROUP_SETTING'];
  }

  public async run(_: BackEvent, source: MessageSource) {
    if (!source.userId) return;
    const profile = await this.channel.getProfileData(source.userId!);
    this.limiter
      .consume(source.groupId!)
      .then(() =>
        this.channel.replyWithText(
          source.replyToken!,
          `Pengaturan di kirim ke ${profile.displayName}!`
        )
      )
      .catch(() => true);
    this.channel.sendMultipleTypeMessage(source.userId!, [
      getGroupSettingMessage(source.groupId!)
    ]);
  }
}
