import * as Line from '@line/bot-sdk';
import qs from 'qs';

import GroupManager from '../manager/GroupManager';
import MessageSource from './base/MessageSource';
import CommandCollections from './commands/CommandCollections';
import commandFactory from './commands/helper/CommandFactory';
import { BackEvent } from '@game/roles/base/RoleTypes';

export default class MessageHandler {
  private readonly commands: CommandCollections;
  private groupManager: GroupManager;

  constructor(groupManager: GroupManager) {
    this.groupManager = groupManager;
    this.commands = new CommandCollections(commandFactory, groupManager);
  }

  /**
   * handleGroupMessage
   */
  public handleGroupMessage(
    message: Line.TextEventMessage,
    source: MessageSource
  ) {
    const { text } = message;
    this.commands.execute(text, {}, source);
  }

  /**
   * handleUserMessage
   */
  public handleUserMessage(
    message: Line.TextEventMessage,
    source: MessageSource
  ) {
    const { text } = message;
    this.commands.execute(text, {}, source);
  }

  /**
   * handlePsotbackData
   */
  public handlePsotbackData(postBack: Line.Postback, source: MessageSource) {
    const data = qs.parse(postBack.data) as BackEvent;
    this.commands.execute(data.type, data, source);
  }
}
