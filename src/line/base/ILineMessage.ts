import * as Line from '@line/bot-sdk';
import Player from '@game/base/Player';

export default interface ILineMessage {
  replyWithText(replyToken: string, text: string): void;
  gameLoopBroadcast(groupId: string, message: string): Promise<any>;
  sendWithText(id: string, text: string): Promise<any>;
  getProfileData(userId: string): Promise<Line.Profile>;
  sendTemplateMessage(userId: string, template: Line.TemplateMessage[]): void;
  sendMultiText(player: Player[], text: string): void;
  sendMultipleText(id: string, text: string[]): void;
  sendMultipleTypeMessage(id: string, message: Line.Message[]): void;
  sendFlexBasicMessage(
    id: string,
    header: string,
    message: string
  ): Promise<any>;
  replyWithAny(id: string, message: Line.Message): void;
}
