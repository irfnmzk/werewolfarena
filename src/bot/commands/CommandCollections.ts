import Command from './base/Command';

export default class CommandCollections extends Map<string, Command> {
  private readonly commands: Command[];

  constructor(commands: Command[]) {
    super();
    this.commands = commands;

    this.registerCommands(commands);
  }

  /**
   * execute
   * execute the given triger
   */
  public execute(command: string, source: any) {
    if (this.has(command)) {
      if (!this.canRunCommand(command, source)) return;
      this.get(command)!.run(command, source);
    }
  }

  private registerCommands(commands: Command[]) {
    commands.forEach(command => this.registerTriggers(command));
  }

  private registerTriggers(command: Command) {
    this.set(command.TRIGGER, command);
  }

  private canRunCommand(commandName: string, source: any) {
    const command = this.get(commandName)!;
    console.log(command.TYPE, source.type);
    console.log(command.TYPE.filter(data => data === source.type).length >= 1);
    return command.TYPE.filter(data => data === source.type).length >= 1;
  }
}
