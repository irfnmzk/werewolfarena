import { database } from 'firebase-admin';
import User from '../models/User';
import { Profile } from '@line/bot-sdk';

export default class UsersAdapter {
  private readonly db: database.Database;

  constructor(db: database.Database) {
    this.db = db;
  }

  /**
   * firstOrCreate
   */
  public async firstOrCreate(profile: Profile) {
    const data = await this.db.ref('users/' + profile.userId).once('value');
    if (data.val()) {
      return data.val() as User;
    }
    const user: User = { name: profile.displayName, userId: profile.userId };
    this.db.ref('users/' + profile.userId).set(user);
    return user;
  }
}
