import { database } from 'firebase-admin';

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
}
