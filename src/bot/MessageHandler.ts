import * as Line from '@line/bot-sdk';
import qs from 'qs';

import GroupManager from '../manager/GroupManager';
import MessageSource from './base/MessageSource';
import CommandCollections from './commands/CommandCollections';
import commandFactory from './commands/helper/CommandFactory';
import { BackEvent } from '@game/roles/base/RoleTypes';
import UserManager from '../manager/UserManager';

export default class MessageHandler {
  private readonly commands: CommandCollections;
  private groupManager: GroupManager;
  private userManager: UserManager;

  constructor(groupManager: GroupManager, userManager: UserManager) {
    this.groupManager = groupManager;
    this.userManager = userManager;
    this.commands = new CommandCollections(
      commandFactory,
      this.groupManager,
      this.userManager
    );
  }

  /**
   * handleGroupMessage
   */
  public handleGroupMessage(
    message: Line.TextEventMessage,
    source: MessageSource
  ) {
    const { text } = message;
    const command = text.split(' ');
    this.commands.execute(
      command[0],
      command.length > 1 ? command[1] : {}, // Also refactor this
      source
    );
  }

  /**
   * handleUserMessage
   */
  public handleUserMessage(
    message: Line.TextEventMessage,
    source: MessageSource
  ) {
    const { text } = message;
    const command = text.split(' ');
    this.commands.execute(
      command[0],
      command.length > 1 ? command[1] : {}, // Also refactor this
      source
    );
  }

  /**
   * handlePsotbackData
   */
  public handlePsotbackData(postBack: Line.Postback, source: MessageSource) {
    const data = qs.parse(postBack.data) as BackEvent;
    this.commands.execute(data.type, data, source);
  }
}
