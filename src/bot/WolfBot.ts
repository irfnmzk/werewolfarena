import * as Line from '@line/bot-sdk';

import GameManager from '../manager/GameManager';
import Config from '../config/Config';
import LineBot from '../line/linebot';
import MessageHandler from './MessageHandler';

export default class WolfBot {
  private readonly config: Config;
  private readonly lineBot: LineBot;
  private readonly messageHandler: MessageHandler;
  private gameManager: GameManager;

  constructor() {
    this.config = new Config();
    this.lineBot = new LineBot(this.config);
    this.gameManager = new GameManager();
    this.messageHandler = new MessageHandler(this.gameManager);

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
    this.lineBot.on('postback', this.onPostBack.bind(this));
  }

  private onUserMessage(sources: Line.EventSource, data: Line.MessageEvent) {
    const source = sources as any;
    source.replyToken = data.replyToken;
    source.type = 'USER';
    const message = data.message as Line.TextEventMessage;
    this.messageHandler.handleUserMessage(message, source);
  }

  private onGroupMessage(sources: Line.EventSource, data: Line.MessageEvent) {
    const source = sources as any;
    source.replyToken = data.replyToken;
    source.type = 'GROUP';
    if ((source as Line.Room).roomId) {
      (source as any).groupId = (source as Line.Room).roomId;
    }
    const message = data.message as Line.TextEventMessage;
    this.messageHandler.handleGroupMessage(message, source);
  }

  private onPostBack(sources: Line.EventSource, data: Line.PostbackEvent) {
    const source = sources as any;
    source.replyToken = data.replyToken;
    source.type = 'POSTBACK';
    const postbackData = data.postback;
    this.messageHandler.handlePsotbackData(postbackData, source);
  }
}
