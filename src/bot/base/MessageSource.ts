export default interface MessageSource {
  type: 'USER' | 'GROUP' | 'POSTBACK';
  groupId?: string;
  userId: string;
  replyToken?: string;
}
