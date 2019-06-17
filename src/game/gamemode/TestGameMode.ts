import Player from '@game/base/Player';
import RolesFactory from './base/RolesFactory';
import Game from '@game/Game';
import GameMode from './base/GameMode';

export default class TestGameMode extends GameMode {
  constructor(game: Game) {
    super(game);

    this.name = 'Test';
    this.MIN_PLAYER = 4;
    this.MAX_PLAYER = 20;
  }

  /**
   * assignRoles
   */
  public assignRoles(players: Player[]) {
    players[0].role = new RolesFactory.Werewolf(this.game, players[0]);
    players[1].role = new RolesFactory.Doctor(this.game, players[1]);
    players[2].role = new RolesFactory.Villager(this.game, players[2]);
    players[3].role = new RolesFactory.Villager(this.game, players[3]);
    players[4].role = new RolesFactory.Villager(this.game, players[4]);
  }
}
