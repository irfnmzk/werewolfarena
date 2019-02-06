import Player from '@game/base/Player';
import RolesFactory from './base/RolesFactory';
import Game from '@game/Game';
import GameMode from './base/GameMode';
import _ from 'lodash';

export default class DefaultGameMode extends GameMode {
  constructor(game: Game) {
    super(game);

    this.name = 'Default';
    this.MIN_PLAYER = 5;
    this.MAX_PLAYER = 12;
  }

  /**
   * assignRoles
   */
  public assignRoles(players: Player[]) {
    let roles: string[] = [];
    const anotherRoles = _.shuffle(['Fool', 'Drunk', 'Cursed', 'Traitor']);
    let playerCount = players.length;
    if (players.length <= 6) {
      this.requiredRole = {
        Werewolf: 1,
        Guardian: 1,
        Seer: 1,
        Villager: 1
      };
    } else if (players.length <= 9) {
      this.requiredRole = {
        Werewolf: this.getRandomCount(1, 2),
        Guardian: 1,
        Seer: 1,
        Villager: this.getRandomCount(1, 2)
      };
    } else {
      this.requiredRole = {
        Werewolf: this.getRandomCount(2, 3),
        Guardian: 1,
        Seer: 1,
        Villager: 2
      };
    }

    Object.keys(this.requiredRole).forEach(key =>
      Array(this.requiredRole![key])
        .fill(1, 0, this.requiredRole![key])
        .forEach(() => {
          roles.push(key);
          playerCount--;
        })
    );
    Array(playerCount)
      .fill(1, 0, playerCount)
      .forEach(() => {
        if (anotherRoles.length > 0) return roles.push(anotherRoles.pop()!);
        roles.push('Villager');
      });

    const suffledPlayer = _.shuffle(players);
    roles = _.shuffle(roles);

    suffledPlayer.forEach(
      (player, index) =>
        (player.role = new RolesFactory[roles[index]](this.game, player))
    );
  }
}
