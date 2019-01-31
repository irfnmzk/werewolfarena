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
    players[0].role = new RolesFactory.Villager(this.game, players[0]);
    players[1].role = new RolesFactory.Villager(this.game, players[1]);
    players[2].role = new RolesFactory.Villager(this.game, players[2]);
    players[3].role = new RolesFactory.Werewolf(this.game, players[3]);
    players[4].role = new RolesFactory.Werewolf(this.game, players[4]);
  }
}
