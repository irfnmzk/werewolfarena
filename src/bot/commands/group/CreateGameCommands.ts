import Command from '../base/Command';

export default class CreateGameCommand implements Command {
  public readonly TRIGGER = '/buat';
  public readonly TYPE = ['GROUP'];

  /**
   * run
   * Run The Command
   */
  public run(message: string, source: any) {
    console.log('ini dari command');
  }
}
