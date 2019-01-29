import Role from './base/Role';
import Game from '@game/Game';
import Player from '@game/base/Player';

export default class Villager extends Role {
  constructor(game: Game, player: Player) {
    super(game, player);

    this.id = 'wolf';
    this.name = 'Wolf';
  }

  public eventAnnouncement() {
    this.game.channel.sendWithText(this.userId, 'kamu adalah Werewolf');
  }

  /**
   * eve
   */
  public eve() {}
}
