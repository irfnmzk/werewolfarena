// tslint:disable:no-unused
import GroupManager from '../../../manager/GroupManager';
import MessageSource from '../../base/MessageSource';
import ILineMessage from 'src/line/base/ILineMessage';
import UserManager from '../../../manager/UserManager';

export default class Command {
  public TYPE: string[];
  public TRIGGER: string[];

  public channel: ILineMessage;
  public groupManager?: GroupManager;
  public userManager?: UserManager;

  constructor(channel: ILineMessage) {
    this.channel = channel;

    this.TYPE = [];
    this.TRIGGER = [];
  }

  /**
   * prepare
   */
  public prepare(groupManager: GroupManager, userManager: UserManager) {
    this.groupManager = groupManager;
    this.userManager = userManager;
  }

  /**
   * run
   */
  public run(data: any, source: MessageSource) {
    // To Be override
  }
}
