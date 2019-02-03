import { database } from 'firebase-admin';
import GroupStats from '../models/GroupStats';

export default class GroupAdapter {
  private readonly db: database.Database;
  private prefix: string;
  private ref: database.Reference;

  constructor(db: database.Database, prefix: string) {
    this.db = db;
    this.prefix = prefix;
    this.ref = this.db.ref(this.prefix);
  }

  /**
   * firstOrCreate
   */
  public async firstOrCreate(groupId: string) {
    const data = await this.ref.child('groups/' + groupId).once('value');
    if (data.val()) {
      return data.val();
    }
    const group = { groupId };
    this.ref.child('groups/' + groupId).set(group);
    return group;
  }

  /**
   * getStats
   * get group stats
   */
  public async getStats(groupId: string) {
    const data = await this.ref.child('group_stats/' + groupId).once('value');
    if (data.val()) return data.val();
    const groupStats: GroupStats = {
      gamePlayed: 0
    };
    this.ref.child('group_stats/' + groupId).set(groupStats);
    return groupStats;
  }
}
