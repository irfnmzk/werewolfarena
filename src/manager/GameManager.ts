import Game from 'src/game/Game';

export default class GameManager extends Map<string, Game> {
  /**
   * createGame
   * Add game to game manager
   */
  public createGame(game: Game) {
    this.set(game.groupId, game);
  }

  /**
   * deleteGame
   */
  public deleteGame(groupId: string) {
    this.delete(groupId);
  }

  /**
   * gameExist
   */
  public gameExist(groupId: string) {
    return this.has(groupId);
  }
}
