import MessageSource from '@bot/base/MessageSource';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';
import { rolesMessage } from './helper/RolesMessageGenerator';

export default class RolesCommand extends Command {
  constructor(channel: LineMessage) {
    super(channel);

    this.TYPE = ['GROUP', 'USER'];
    this.TRIGGER = ['/roles', '/daftarperan'];
  }

  /**
   * run
   * Run The Command
   */
  public async run(data: any, source: MessageSource) {
    const page = parseInt(data);
    if (!page) {
      return this.channel.replyWithAny(source.replyToken!, rolesMessage());
    }
  }
}
