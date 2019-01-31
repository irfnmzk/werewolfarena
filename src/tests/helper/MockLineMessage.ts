import ILineMessage from 'src/line/base/ILineMessage';
import * as Line from '@line/bot-sdk';
import Player from '@game/base/Player';

export default class MockLineMessage implements ILineMessage {
  public replyWithText(replyToken: string = '', text: string) {
    console.log(`Reply message to ${replyToken} : ${text}`);
  }

  public gameLoopBroadcast(groupId: string, message: string): Promise<any> {
    console.log(`GameLoopBroadcast to ${groupId} : ${message}`);
    return Promise.resolve();
  }

  public sendWithText(id: string, text: string): Promise<any> {
    console.log(`Send text to ${id} : ${text}`);

    return Promise.resolve();
  }

  public getPlayerData(userId: string): Promise<Player> {
    console.log(`Getting Player Data : ${userId}`);
    const data: Player = { name: 'test', userId: '1111' };
    return Promise.resolve(data);
  }

  public sendTemplateMessage(
    userId: string,
    template: Line.TemplateMessage[]
  ): void {
    console.log(`Send template Message to ${userId} : ${template[0].altText}`);
  }

  public sendMultiText(player: Player[], text: string): void {
    console.log(`send multiText to ${player.length} user : ${text}`);
  }
}
