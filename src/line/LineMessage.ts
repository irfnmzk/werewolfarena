import * as Line from '@line/bot-sdk';
import to from 'await-to-js';
import Player from '@game/base/Player';
import ILineMessage from './base/ILineMessage';

export default class LineMessage extends Line.Client implements ILineMessage {
  constructor(config: Line.ClientConfig) {
    super(config);
  }

  public replyWithText(replyToken: string, text: string) {
    this.replyMessage(replyToken, {
      type: 'text',
      text
    }).catch(_ => console.error('err when rplying'));
  }

  public async gameLoopBroadcast(
    groupId: string,
    message: string
  ): Promise<any> {
    const [err, _] = await to<Line.Profile>(
      this.pushMessage(groupId, {
        type: 'text',
        text: message
      })
    );
    if (err) console.log(err);
    return Promise.resolve(_);
  }

  public sendWithText(id: string, text: string): Promise<any> {
    return this.pushMessage(id, {
      type: 'text',
      text
    }).catch(err => {
      if (id.length <= 10) return;
      console.log(`err send text to ${id}\nmessage: ${text}`);
      if (err instanceof Line.RequestError) {
        console.log(`error : ${err.message}`);
      }
    });
  }

  public async getProfileData(userId: string): Promise<Line.Profile> {
    const [err, profile] = await to<Line.Profile>(this.getProfile(userId));
    if (err) return Promise.reject();
    return Promise.resolve(profile!);
  }

  public sendTemplateMessage(userId: string, template: Line.TemplateMessage[]) {
    this.pushMessage(userId, template).catch(err => {
      if (userId.length <= 10) {
        return;
      }
      console.log('err send templateMessage to' + userId);
      if (err instanceof Line.RequestError) {
        console.log(`errorMessage: ${err.message}`);
      }
    });
  }

  /**
   * sendMultiText
   */
  public sendMultiText(player: Player[], text: string) {
    if (player.length < 1) return;
    const userIdList = player.map(data => data.userId);
    this.multicast(userIdList, {
      type: 'text',
      text
    }).catch(() => this.sendSingleIfMultiFail(userIdList, text));
  }

  public sendMultipleText(id: string, data: string[]): void {
    const message: Line.TextMessage[] = data.map(text => ({
      type: 'text',
      text
    })) as Line.TextMessage[];
    this.pushMessage(id, message).catch(err => {
      console.error(
        `err send message to ${id} : ${(err as Line.RequestError).message}`
      );
    });
  }

  /**
   * sendMultipleTypeMessage
   */
  public sendMultipleTypeMessage(id: string, message: Line.Message[]) {
    this.pushMessage(id, message).catch(err =>
      console.log(`err send to ${id} :${(err as Line.RequestError).message} `)
    );
  }

  /**
   * Send Message as individual if multicast failed
   */
  private sendSingleIfMultiFail(userIdList: string[], text: string) {
    userIdList.forEach(userId => this.sendWithText(userId, text));
  }
}
