import MessageSource from '@bot/base/MessageSource';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';
import { RoleId } from '../../../game/roles/base/RoleTypes';
import { getInfoMessageByRole } from './helper/InfoMessageGenerator';

export default class InfoCommand extends Command {
  public roles: RoleId[];

  constructor(channel: LineMessage) {
    super(channel);

    this.TYPE = ['GROUP', 'USER'];
    this.TRIGGER = ['/info'];
    this.roles = [
      'werewolf',
      'villager',
      'guardian',
      'seer',
      'drunk',
      'fool',
      'cursed',
      'traitor',
      'lumberjack',
      'gunner',
      'harlot',
      'hunter'
    ];
  }

  /**
   * run
   * Run The Command
   */
  public async run(data: string, source: MessageSource) {
    if (this.roles.filter(role => role === data).length < 1) {
      return;
    }
    return this.channel.replyWithAny(
      source.replyToken!,
      getInfoMessageByRole(data as RoleId, this.localeService)
    );
  }
}
