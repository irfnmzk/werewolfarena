import * as Line from '@line/bot-sdk';
import Player from '@game/base/Player';

export default interface ILineMessage {
  replyWithText(replyToken: string, text: string): void;
  gameLoopBroadcast(groupId: string, message: string): Promise<any>;
  sendWithText(id: string, text: string): Promise<any>;
  getPlayerData(userId: string): Promise<Player>;
  sendTemplateMessage(userId: string, template: Line.TemplateMessage[]): void;
  sendMultiText(player: Player[], text: string): void;
  sendMultipleText(id: string, text: string[]): void;
}
