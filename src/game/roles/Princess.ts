import Role from './base/Role';
import Game from '@game/Game';
import Player from '@game/base/Player';

export default class Princess extends Role {
  constructor(game: Game, player: Player) {
    super(game, player);

    this.id = 'princess';
    this.name = 'Princess';

    this.setRoleHistory(this.id);
  }

  public eventAnnouncement() {
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('role.princess.announcement')
    );
  }
}
