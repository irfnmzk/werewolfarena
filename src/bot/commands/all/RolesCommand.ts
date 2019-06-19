import MessageSource from '@bot/base/MessageSource';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';
import {
  rolesMessage,
  rolesMessage2,
  rolesMessage3
} from './helper/RolesMessageGenerator';

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
    switch (page) {
      case 2:
        return this.channel.replyWithAny(source.replyToken!, rolesMessage2());
        break;
      case 3:
        return this.channel.replyWithAny(source.replyToken!, rolesMessage3());
        break;
      case 4:
        return this.channel.replyWithText(source.replyToken!, 'Coming Soon...');
        break;
      default:
        break;
    }
  }
}
