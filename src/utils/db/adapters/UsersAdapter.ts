import { database } from 'firebase-admin';
import User from '../models/User';
import { Profile } from '@line/bot-sdk';

export default class UsersAdapter {
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
  public async firstOrCreate(profile: Profile) {
    const data = await this.ref.child('users/' + profile.userId).once('value');
    if (data.val()) {
      return data.val() as User;
    }
    const user: User = { name: profile.displayName, userId: profile.userId };
    this.ref.child('users/' + profile.userId).set(user);
    return user;
  }
}
