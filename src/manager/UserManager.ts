import DatabaseAdapter from '../utils/db/DatabaseAdapter';
import Player from '../game/base/Player';
import User from './base/User';
import { Profile } from '@line/bot-sdk';
import PlayerStats from 'src/utils/db/models/PlayerStats';

export default class UserManager extends Map<string, User> {
  private readonly database: DatabaseAdapter;

  constructor(databse: DatabaseAdapter) {
    super();

    this.database = databse;
  }

  /**
   * createUser
   */
  public async createUser(profile: Profile) {
    const userData = await this.database.user.firstOrCreate(profile);
    const user = new User(userData);
    this.set(user.userId, user);
  }

  /**
   * getPlayerData
   */
  public async getPlayerData(profile: Profile): Promise<Player> {
    if (!this.has(profile.userId)) await this.createUser(profile);
    const user = this.get(profile.userId)!;
    const player: Player = {
      name: user.name,
      userId: user.userId
    };
    return player;
  }

  /**
   * getPlayerStats
   */
  public async getPlayerStats(userId: string) {
    const playerStats = await this.database.user.getStats(userId);
    return playerStats;
  }

  /**
   * updatePlayerStats
   */
  public updatePlayerStats(userId: string, stats: PlayerStats) {
    return this.database.user.updatePlayerStats(userId, stats);
  }

  /**
   * getUserData
   */
  public async getUserData(profile: Profile) {
    if (!this.has(profile.userId)) await this.createUser(profile);
    return this.get(profile.userId)!;
  }
}
