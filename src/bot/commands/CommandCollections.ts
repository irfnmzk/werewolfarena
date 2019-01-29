import GameManager from '../../manager/GameManager';
import MessageSource from '../base/MessageSource';
import Command from './base/Command';

export default class CommandCollections extends Map<string, Command> {
  private readonly commands: Command[];
  private gameManager: GameManager;

  constructor(commands: Command[], gameManager: GameManager) {
    super();
    this.commands = commands;
    this.gameManager = gameManager;

    this.registerCommands(commands);
  }

  /**
   * execute
   * execute the given triger
   */
  public execute(command: string, source: MessageSource) {
    if (this.has(command)) {
      if (!this.canRunCommand(command, source)) return;
      this.get(command)!.run(command, source);
    }
  }

  private registerCommands(commands: Command[]) {
    commands.forEach(command => this.registerTriggers(command));
  }

  private registerTriggers(command: Command) {
    command.prepare(this.gameManager);
    this.set(command.TRIGGER, command);
  }

  private canRunCommand(commandName: string, source: MessageSource) {
    const command = this.get(commandName)!;
    return command.TYPE.filter(data => data === source.type).length >= 1;
  }
}
