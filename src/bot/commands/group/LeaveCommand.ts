import MessageSource from '@bot/base/MessageSource';
import Game from '../.././../game/Game';
import LineMessage from 'src/line/LineMessage';

import Command from '../base/Command';

export default class CreateGameCommand extends Command {
  constructor(channel: LineMessage) {
    super(channel);

    this.TRIGGER = ['/buat', '/create'];
    this.TYPE = ['GROUP'];
  }

  /**
   * run
   * Run The Command
   */
  public async run(_: string, source: MessageSource) {
    // TODO:   
  }
}
