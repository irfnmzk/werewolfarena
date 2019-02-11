import MessageSource from '@bot/base/MessageSource';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';
import {
  getTutorialMessage,
  getTutorialMessage_2
} from './helper/TutorialMessageGenerator';

export default class TutorialCommand extends Command {
  constructor(channel: LineMessage) {
    super(channel);

    this.TYPE = ['GROUP', 'USER'];
    this.TRIGGER = ['/tutorial'];
  }

  /**
   * run
   * Run The Command
   */
  public async run(data: any, source: MessageSource) {
    const page = parseInt(data);
    if (!page) {
      return this.channel.replyWithAny(
        source.replyToken!,
        getTutorialMessage(this.localeService)
      );
    }
    // tslint:disable-next-line:early-exit
    if (page === 2) {
      return this.channel.replyWithAny(
        source.replyToken!,
        getTutorialMessage_2(this.localeService)
      );
    }
  }
}
