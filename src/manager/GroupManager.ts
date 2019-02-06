import Game from 'src/game/Game';
import Group from './base/Group';
import DatabaseAdapter from '../utils/db/DatabaseAdapter';

export default class GroupManager extends Map<string, Group> {
  private readonly database: DatabaseAdapter;

  constructor(database: DatabaseAdapter) {
    super();

    this.database = database;
  }

  /**
   * createGroup
   */
  public async createGroup(groupId: string) {
    // Todo check from db
    const groupData = await this.database.group.firstOrCreate(groupId);
    const groupStats = await this.database.group.getStats(groupId);
    const group = new Group(groupData.groupId, groupStats);
    this.set(groupId, group);
  }

  /**
   * createGame
   * Add game to to room
   */
  public async createGame(groupId: string, game: Game) {
    if (!this.has(groupId)) await this.createGroup(groupId);
    this.get(groupId)!.game = game;
    this.get(groupId)!.running = true;
    this.notifyUsers(groupId);
  }

  /**
   * gameExist
   */
  public async gameExist(groupId: string) {
    if (!this.has(groupId)) await this.createGroup(groupId);
    return this.get(groupId)!.running;
  }

  /**
   * deletGame
   */
  public deletGame(groupId: string) {
    const group = this.get(groupId)!;
    group.game = undefined; // any better solution?
    group.running = false;
  }

  /**
   * killGroup
   */
  public killGroup(groupId: string) {
    if (!this.has(groupId)) return;
    this.get(groupId)!.game!.killGame();
    this.delete(groupId);
  }

  /**
   * notifyUserForGame
   */
  public async notifyUserForGame(groupId: string, userId: string) {
    if (!this.has(groupId)) await this.createGroup(groupId);
    this.get(groupId)!.notifyUserList.push(userId);
  }

  /**
   * getStats
   */
  public async getStats(groupId: string) {
    if (!this.has(groupId)) await this.createGroup(groupId);
    return this.get(groupId)!.groupStats;
  }

  /**
   * updateStatistics
   */
  public updateStats(groupId: string) {
    const oldStats = this.get(groupId)!.groupStats;
    const newStats = {
      ...oldStats,
      gamePlayed: oldStats.gamePlayed + 1
    };
    this.get(groupId)!.groupStats = newStats;
    this.database.group.updateStats(groupId, newStats);
  }

  private notifyUsers(groupId: string) {
    this.get(groupId)!.notifyUserList.forEach(userId => {
      this.get(groupId)!.game!.sendNotifyToWaitingList(userId);
    });
    this.get(groupId)!.notifyUserList = [];
  }
}
