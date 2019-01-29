import * as Line from '@line/bot-sdk';

import Config from '../config/Config';
import LineBot from '../line/linebot';
import MessageHandler from './MessageHandler';

export default class WolfBot {
  private readonly config: Config;
  private readonly lineBot: LineBot;
  private readonly messageHandler: MessageHandler;

  constructor() {
    this.config = new Config();
    this.lineBot = new LineBot(this.config);
    this.messageHandler = new MessageHandler();

    this.addEventListener();
  }

  /**
   * start
   * Start Line Webhook
   */
  public start() {
    console.info('Starting webhook..');
    this.lineBot.listen();
  }

  private addEventListener() {
    this.lineBot.on('userMessage', this.onUserMessage.bind(this));
    this.lineBot.on('groupMessage', this.onGroupMessage.bind(this));
  }

  private onUserMessage(source: Line.EventSource, data: Line.MessageEvent) {
    (source as any).replyToken = data.replyToken;
    (source as any).type = 'USER';
    const message = data.message as Line.TextEventMessage;
    this.messageHandler.handleUserMessage(message, source);
  }

  private onGroupMessage(source: Line.EventSource, data: Line.MessageEvent) {
    (source as any).replyToken = data.replyToken;
    (source as any).type = 'GROUP';
    const message = data.message as Line.TextEventMessage;
    this.messageHandler.handleGroupMessage(message, source);
  }
}
