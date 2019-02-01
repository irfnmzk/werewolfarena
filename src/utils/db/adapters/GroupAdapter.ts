import { database } from 'firebase-admin';

export default class GroupAdapter {
  private readonly db: database.Database;

  constructor(db: database.Database) {
    this.db = db;
  }

  /**
   * firstOrCreate
   */
  public async firstOrCreate(groupId: string) {
    const data = await this.db.ref('groups/' + groupId).once('value');
    if (data.val()) {
      return data.val();
    }
    const group = { groupId };
    this.db.ref('groups/' + groupId).set(group);
    return group;
  }
}
