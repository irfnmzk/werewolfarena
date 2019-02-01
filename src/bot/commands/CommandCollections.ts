import GroupManager from '../../manager/GroupManager';
import MessageSource from '../base/MessageSource';
import Command from './base/Command';

export default class CommandCollections extends Map<string, Command> {
  private readonly commands: Command[];
  private groupManager: GroupManager;

  constructor(commands: Command[], groupManager: GroupManager) {
    super();
    this.commands = commands;
    this.groupManager = groupManager;

    this.registerCommands(commands);
  }

  /**
   * execute
   * execute the given triger
   */
  public execute(command: string, data: any, source: MessageSource) {
    if (this.has(command)) {
      if (!this.canRunCommand(command, source)) return;
      this.get(command)!.run(data, source);
    }
  }

  private registerCommands(commands: Command[]) {
    commands.forEach(command => this.registerTriggers(command));
  }

  private registerTriggers(command: Command) {
    command.prepare(this.groupManager);
    command.TRIGGER.forEach(trigger => this.set(trigger, command));
  }

  private canRunCommand(commandName: string, source: MessageSource) {
    const command = this.get(commandName)!;
    return command.TYPE.filter(data => data === source.type).length >= 1;
  }
}
