import * as Line from '@line/bot-sdk';

import Config from '../config/Config';
import LineBot from '../line/linebot';

export default class WolfBot {
  private readonly config: Config;
  private readonly lineBot: LineBot;

  constructor() {
    this.config = new Config();
    this.lineBot = new LineBot(this.config);

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
    this.lineBot.on('message', data => this.onMessage(data.message));
    this.lineBot.on('userMessage', this.onUserMessage);
    this.lineBot.on('gorupMessage', this.onGroupMessage);
  }

  private onMessage(data: Line.TextEventMessage) {
    // console.log(data);
  }

  private onUserMessage(source: Line.EventSource, data: Line.MessageEvent) {
    console.log('user message');
  }

  private onGroupMessage(source: Line.EventSource, data: Line.MessageEvent) {
    console.log('group message');
  }
}
