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
    this.MAX_PLAYER = 20;

    this.deck = {
      villager: 6,
      werewolf: 3,
      guardian: 1,
      seer: 1,
      drunk: 1,
      fool: 1,
      cursed: 1,
      traitor: 1,
      lumberjack: 4,
      gunner: 1,
      harlot: 1,
      hunter: 1,
      lycan: 1,
      beholder: 1,
      wolfman: 1,
      princess: 1,
      tanner: 1,
      doctor: 1
    };

    this.requiredRole = {
      Seer: 1,
      Guardian: 1
    };
  }

  /**
   * assignRoles
   */
  public assignRoles(players: Player[]) {
    const data = this.roleGenerator.create(
      players.length,
      this.generateDeck(this.deck),
      'NORMAL'
    );
    let roles: string[] = [];
    Object.keys(data.deck).forEach(item => {
      _.range(data.deck[item]).forEach(() => {
        roles.push(_.capitalize(item));
      });
    });

    // If there are no wolf just replace the first roles with werewolf
    // TODO: Refactor this
    if (roles.indexOf('Werewolf') === -1) {
      roles[0] = 'Werewolf';
    }

    // Replace lumberjack or villager with required role
    Object.keys(this.requiredRole!).forEach(item => {
      if (roles.indexOf(item) !== -1) return;
      if (roles.indexOf('Villager') !== -1) {
        roles[roles.indexOf('Villager')] = item;
      } else if (roles.indexOf('Lumberjack') !== -1) {
        roles[roles.indexOf('Lumberjack')] = item;
      }
    });

    if (roles.filter(role => role === 'Lumberjack').length === 1) {
      roles[roles.indexOf('Lumberjack')] = 'Villager';
    }

    const suffledPlayer = _.shuffle(players);
    roles = _.shuffle(roles);
    suffledPlayer.forEach(
      (player, index) =>
        (player.role = new RolesFactory[roles[index]](this.game, player))
    );
    console.log(roles);
  }
}
