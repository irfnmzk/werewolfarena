import * as Line from '@line/bot-sdk';
// tslint:disable-next-line:no-var-requires
const localTunnel = require('localtunnel');

import GroupManager from '../manager/GroupManager';
import Config from '../config/Config';
import LineBot from '../line/linebot';
import MessageHandler from './MessageHandler';
import DatabaseAdapter from '../utils/db/DatabaseAdapter';
import UserManager from '../manager/UserManager';
import LineMessage from '../line/LineMessage';

export default class WolfBot {
  private readonly config: Config;
  private readonly lineBot: LineBot;
  private readonly messageHandler: MessageHandler;
  private readonly database: DatabaseAdapter;
  private groupManager: GroupManager;
  private userManager: UserManager;
  private channel: LineMessage;

  constructor() {
    this.config = new Config();
    this.lineBot = new LineBot(this.config);
    this.database = new DatabaseAdapter();
    this.groupManager = new GroupManager(this.database);
    this.userManager = new UserManager(this.database);
    this.messageHandler = new MessageHandler(
      this.groupManager,
      this.userManager
    );
    this.channel = new LineMessage(this.config);

    this.addEventListener();
    this.setupLocalTunnel();
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
    this.lineBot.on('leave', this.onLeaveEvent.bind(this));
    this.lineBot.on('join', this.onJoinEvent.bind(this));
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

  private onLeaveEvent(sources: Line.EventSource, _: Line.LeaveEvent) {
    const source = sources as any;
    if ((source as Line.Room).roomId) {
      (source as any).groupId = (source as Line.Room).roomId;
    }
    this.groupManager.killGroup(source.groupId);
  }

  private onJoinEvent(sources: Line.EventSource, _: Line.LeaveEvent) {
    const source = sources as any;
    if ((source as Line.Room).roomId) {
      (source as any).groupId = (source as Line.Room).roomId;
    }
    // Refactor this
    this.channel.sendWithText(
      source.groupId,
      `📣 Halo Semuanya 👋 \n\n🙏 Terima kasih sudah mengundang saya ke grup. untuk memulai permainan ketik /buat`
    );
  }

  private setupLocalTunnel() {
    localTunnel(5000, (_: any, data: any) => {
      console.log(data);
    });
  }
}
