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

  public sendWithText(id: string, text: string) {
    this.pushMessage(id, {
      type: 'text',
      text
    }).catch(_ => console.error('wee when send text'));
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
}