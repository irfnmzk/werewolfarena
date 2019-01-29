import * as Line from '@line/bot-sdk';

export default class LineMessage extends Line.Client {
  constructor(config: Line.ClientConfig) {
    super(config);
  }

  public replyWithText(replyToken: string, text: string) {
    this.replyMessage(replyToken, {
      type: 'text',
      text
    }).catch(err => console.error(err));
  }
}
