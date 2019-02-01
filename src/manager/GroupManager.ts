import Game from 'src/game/Game';
import Group from './base/Group';

export default class GroupManager extends Map<string, Group> {
  /**
   * createGroup
   */
  public createGroup(groupId: string) {
    // Todo check from db
    console.log('adding group');
    const group = new Group(groupId);
    this.set(groupId, group);
  }

  /**
   * createGame
   * Add game to to room
   */
  public createGame(groupId: string, game: Game) {
    if (!this.has(groupId)) this.createGroup(groupId);
    this.get(groupId)!.game = game;
    this.get(groupId)!.running = true;
  }

  /**
   * deleteGame
   */
  public deleteGame(groupId: string) {
    if (!this.has(groupId)) this.createGroup(groupId);
    this.get(groupId)!.game = undefined;
  }

  /**
   * gameExist
   */
  public gameExist(groupId: string) {
    if (!this.has(groupId)) this.createGroup(groupId);
    return this.get(groupId)!.running;
  }
}
