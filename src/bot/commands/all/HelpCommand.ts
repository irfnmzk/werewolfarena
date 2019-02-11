import MessageSource from '@bot/base/MessageSource';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';
import { getHelpMessage } from './helper/TutorialMessageGenerator';

export default class HelpCommand extends Command {
  constructor(channel: LineMessage) {
    super(channel);

    this.TYPE = ['GROUP', 'USER'];
    this.TRIGGER = ['/help'];
  }

  /**
   * run
   * Run The Command
   */
  public async run(_: any, source: MessageSource) {
    return this.channel.replyWithAny(source.replyToken!, getHelpMessage());
  }
}
