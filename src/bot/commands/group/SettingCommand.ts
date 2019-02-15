import MessageSource from '@bot/base/MessageSource';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';
import { getSettingMessage } from './helper/SettingMessageGenerator';

export default class SettingCommand extends Command {
  constructor(channel: LineMessage) {
    super(channel);

    this.TYPE = ['GROUP'];
    this.TRIGGER = ['/setting', '/pengaturan'];
  }

  /**
   * run
   * Run The Command
   */
  public async run(_: string, source: MessageSource) {
    const { groupId } = source;
    if (!groupId) return;

    const option = await this.groupManager!.getGroupSetting(groupId);
    this.channel.replyWithAny(
      source.replyToken!,
      getSettingMessage(option, groupId)
    );
  }
}
