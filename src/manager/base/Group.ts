import Game from '@game/Game';
import GroupStats from '../../utils/db/models/GroupStats';

export default class Group {
  public readonly groupId: string;
  public running: boolean = false;
  public game?: Game;

  public lastRun: number = Date.now();

  public groupStats: GroupStats;

  public notifyUserList: string[];

  constructor(groupId: string, stats: GroupStats) {
    this.groupId = groupId;
    this.groupStats = stats;
    this.notifyUserList = [];
  }
}
