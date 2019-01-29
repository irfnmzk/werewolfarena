import * as Line from '@line/bot-sdk';

import CommandCollections from './commands/CommandCollections';
import commandFactory from './commands/helper/CommandFactory';

export default class MessageHandler {
  private readonly commands: CommandCollections;

  constructor() {
    this.commands = new CommandCollections(commandFactory);
  }

  /**
   * handleGroupMessage
   */
  public handleGroupMessage(message: Line.TextEventMessage, source: any) {
    const { text } = message;
    this.commands.execute(text, source);
  }

  /**
   * handleUserMessage
   */
  public handleUserMessage(message: Line.TextEventMessage, source: any) {}
}
