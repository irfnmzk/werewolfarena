import MessageSource from '@bot/base/MessageSource';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';

export default class VersionCommand extends Command {
  constructor(channel: LineMessage) {
    super(channel);

    this.TYPE = ['GROUP', 'USER'];
    this.TRIGGER = ['/v', '/version', '/versi'];
  }

  /**
   * run
   * Run The Command
   */
  public async run(_: string, source: MessageSource) {
    const version = process.env.npm_package_version;
    this.channel.replyWithText(
      source.replyToken!,
      `📣 versi Game saat ini v${version}`
    );
  }
}
