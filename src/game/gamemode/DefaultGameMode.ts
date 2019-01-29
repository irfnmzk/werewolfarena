import Player from '@game/base/Player';
import RolesFactory from './base/RolesFactory';
import Game from '@game/Game';

export default class DefaultGameMode {
  private game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  /**
   * assignRoles
   */
  public assignRoles(players: Player[]) {
    players.forEach(player => {
      player.role = new RolesFactory.Villager(this.game, player);
    });
  }
}
