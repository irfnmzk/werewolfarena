export default interface MessageSource {
  type: 'USER' | 'GROUP';
  groupId?: string;
  userId: string;
  replyToken: string;
}
