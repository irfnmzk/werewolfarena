import MessageSource from '@bot/base/MessageSource';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';

export default class ExtendCommand extends Command {
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

    // Need to be deleted
    this.channel.sendMultipleTypeMessage(source.userId!, [
      {
        type: 'imagemap',
        baseUrl: 'https://himestore.com/assets/img/kolase',
        altText: 'This is an imagemap',
        baseSize: {
          width: 1040,
          height: 1040
        },
        actions: [
          {
            type: 'uri',
            linkUri: 'https://example.com/',
            area: {
              x: 0,
              y: 586,
              width: 520,
              height: 454
            }
          }
        ]
      }
    ]);
  }
}
