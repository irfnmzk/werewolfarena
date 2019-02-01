// tslint:disable:no-unused
import GameManager from '../../../manager/GameManager';
import MessageSource from '../../base/MessageSource';
import ILineMessage from 'src/line/base/ILineMessage';

export default class Command {
  public TYPE: string[];
  public TRIGGER: string[];

  public channel: ILineMessage;
  public gameManager?: GameManager;

  constructor(channel: ILineMessage) {
    this.channel = channel;

    this.TYPE = [];
    this.TRIGGER = [];
  }

  /**
   * prepare
   */
  public prepare(gameManager: GameManager) {
    this.gameManager = gameManager;
  }

  /**
   * run
   */
  public run(data: any, source: MessageSource) {
    // To Be override
  }
}
