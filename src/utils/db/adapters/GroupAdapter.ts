import { database } from 'firebase-admin';
import GroupStats from '../models/GroupStats';
import GroupSetting from '../models/GroupSetting';

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
    this.ref
      .child('groups/' + groupId)
      .set(group)
      .catch(() => console.log(`fail to save database`));
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
    this.ref
      .child('group_stats/' + groupId)
      .set(groupStats)
      .catch(() => console.log(`fail to save database`));
    return groupStats;
  }

  /**
   * updateStats
   */
  public updateStats(groupId: string, data: GroupStats) {
    return this.ref
      .child('group_stats/' + groupId)
      .set(data)
      .catch(() => console.log(`fail to save database`));
  }

  /**
   * getGroupSetting
   */
  public async getGroupSetting(groupId: string) {
    const data = await this.ref.child('group_setting/' + groupId).once('value');
    if (data.val()) return data.val();
    const groupSetting: GroupSetting = {
      showRole: 'YA',
      duration: 60
    };
    this.ref
      .child('group_setting/' + groupId)
      .set(groupSetting)
      .catch(() => console.log(`fail to save database`));
    return groupSetting;
  }

  /**
   * setGroupSetting
   */
  public setGroupSetting(groupId: string, setting: GroupSetting) {
    this.ref
      .child('group_setting/' + groupId)
      .set(setting)
      .catch(() => console.log(`fail to save database`));
  }
}
