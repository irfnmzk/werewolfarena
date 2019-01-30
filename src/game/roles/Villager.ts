import Role from './base/Role';
import Game from '@game/Game';
import Player from '@game/base/Player';

export default class Villager extends Role {
  constructor(game: Game, player: Player) {
    super(game, player);

    this.id = 'villager';
    this.name = 'Villager';
  }

  public eventAnnouncement() {
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('role.villager.announcement')
    );
  }
}
