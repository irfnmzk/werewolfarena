// tslint:disable:no-unused
import GroupManager from '../../../manager/GroupManager';
import MessageSource from '../../base/MessageSource';
import ILineMessage from 'src/line/base/ILineMessage';

export default class Command {
  public TYPE: string[];
  public TRIGGER: string[];

  public channel: ILineMessage;
  public groupManager?: GroupManager;

  constructor(channel: ILineMessage) {
    this.channel = channel;

    this.TYPE = [];
    this.TRIGGER = [];
  }

  /**
   * prepare
   */
  public prepare(groupManager: GroupManager) {
    this.groupManager = groupManager;
  }

  /**
   * run
   */
  public run(data: any, source: MessageSource) {
    // To Be override
  }
}
