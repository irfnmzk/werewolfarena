import MessageSource from '@bot/base/MessageSource';
import to from 'await-to-js';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';

export default class JoinGameCommand extends Command {
  constructor(channel: LineMessage) {
    super(channel);

    this.TYPE = ['GROUP'];
    this.TRIGGER = ['/nextgame', '/notify', '/n'];
  }

  /**
   * run
   * Run The Command
   */
  public async run(_: string, source: MessageSource) {
    const { groupId } = source;
    if (!groupId) return;
    if (!source.userId) {
      return this.notAddingAsFriend(source.replyToken!);
    }
    const [err, userData] = await to(
      this.channel.getProfileData(source.userId)
    );
    if (!userData) {
      return this.notAddingAsFriend(source.replyToken!);
    }
    if (err) {
      return this.channel.replyWithText(
        source.replyToken!,
        `Cant get profile data! make sure you're adding this bot as your friend! err(not_add)`
      );
    }
    const player = await this.userManager!.getUserData(userData!);
    await this.groupManager!.notifyUserForGame(groupId!, player.userId);
    this.channel.replyWithText(
      source.replyToken!,
      `Hai ${
        player.name
      } kami akan memberikan notifikasi saat game baru sudah di mulai di grup ini!`
    );
  }
}
