import MessageSource from 'src/bot/base/MessageSource';
import LineMessage from 'src/line/LineMessage';
import Command from '../base/Command';

export default class CreateGameCommand implements Command {
  public readonly TRIGGER = '/buat';
  public readonly TYPE = ['GROUP'];
  public readonly channel: LineMessage;

  constructor(channel: LineMessage) {
    this.channel = channel;
  }

  /**
   * run
   * Run The Command
   */
  public run(_: string, source: MessageSource) {
    this.channel.replyWithText(source.replyToken!, 'Game di buat!');
  }
}
