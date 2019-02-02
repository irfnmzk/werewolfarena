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
    const group = new Group(groupData.groupId);
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
  }

  /**
   * gameExist
   */
  public async gameExist(groupId: string) {
    if (!this.has(groupId)) await this.createGroup(groupId);
    return this.get(groupId)!.running;
  }
}