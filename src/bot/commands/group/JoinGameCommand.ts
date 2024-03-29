import MessageSource from '@bot/base/MessageSource';
import to from 'await-to-js';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';

export default class JoinGameCommand extends Command {
  constructor(channel: LineMessage) {
    super(channel);

    this.TYPE = ['GROUP', 'POSTBACK'];
    this.TRIGGER = ['/join', '/j', 'WEREWOLF_JOIN_EVENT'];
  }

  /**
   * run
   * Run The Command
   */
  public async run(_: string, source: MessageSource) {
    const { groupId } = source;
    if (!groupId) return;
    const gameExist = await this.groupManager!.gameExist(groupId!);
    if (!gameExist) {
      return this.limiter
        .consume(groupId!)
        .then(() =>
          this.channel.replyWithText(source.replyToken!, 'Game not existed')
        )
        .catch(() => true);
    }
    // Any Better solution?
    if (!source.userId) {
      return this.limiter
        .consume(groupId!)
        .then(() => this.notAddingAsFriend(source.replyToken!))
        .catch(() => true);
    }
    const [err, userData] = await to(
      this.channel.getProfileData(source.userId)
    );
    if (err) {
      return this.channel.replyWithText(
        source.replyToken!,
        'Profile doesnt Exist'
      );
    }
    if (!userData) {
      return this.limiter
        .consume(groupId!)
        .then(() => this.notAddingAsFriend(source.replyToken!))
        .catch(() => true);
    }
    if (!this.hasValidName(userData!.displayName)) {
      return this.channel.replyWithText(
        source.replyToken!,
        `Hai ${
          userData!.displayName
        } nama kamu tidak valid! mohon jangan gunakan simbol apapun di nama kamu!`
      );
    }
    const player = await this.userManager!.getPlayerData(userData!);
    this.groupManager!.get(groupId!)!.game!.addPlayer(player!);
  }

  private hasValidName(name: string) {
    const regex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    return regex.test(name);
  }
}
