import { database } from 'firebase-admin';
import User from '../models/User';
import { Profile } from '@line/bot-sdk';
import PlayerStats from '../models/PlayerStats';

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

  /**
   * getStats
   * get group stats
   */
  public async getStats(userId: string) {
    const data = await this.ref.child('player_stats/' + userId).once('value');
    if (data.val()) return data.val();
    const groupStats: PlayerStats = {
      total_game: 0,
      death: 0,
      kill: 0,
      win: 0,
      lose: 0
    };
    this.ref
      .child('player_stats/' + userId)
      .set(groupStats)
      .catch(() => console.log(`fail to save database`));
    return groupStats;
  }

  /**
   * updatePlayerStats
   */
  public updatePlayerStats(userId: string, data: PlayerStats) {
    return this.ref.child('player_stats/' + userId).set(data);
  }
}
