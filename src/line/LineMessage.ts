import * as Line from '@line/bot-sdk';
import to from 'await-to-js';
import Player from '@game/base/Player';

export default class LineMessage extends Line.Client {
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

  public sendWithText(id: string, text: string) {
    this.pushMessage(id, {
      type: 'text',
      text
    }).catch(err => {
      if (id.length >= 5) {
        console.log(err);
      }
    });
  }

  public async getPlayerData(userId: string): Promise<Player> {
    const [err, profile] = await to<Line.Profile>(this.getProfile(userId));
    if (err) return Promise.reject();
    const player: Player = {
      userId: profile!.userId,
      name: profile!.displayName
    };
    return Promise.resolve(player);
  }

  public sendTemplateMessage(userId: string, template: Line.TemplateMessage[]) {
    this.pushMessage(userId, template).catch(err => {
      if (userId.length >= 5) {
        console.log(err);
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
    }).catch(err => {
      console.log(err);
    });
  }
}
