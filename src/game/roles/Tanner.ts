import Role from './base/Role';
import Game from '@game/Game';
import Player from '@game/base/Player';

export default class Tanner extends Role {
  constructor(game: Game, player: Player) {
    super(game, player);

    this.id = 'tanner';
    this.name = 'Tanner';

    this.team = 'TANNER';

    this.setRoleHistory(this.id);
  }

  public eventAnnouncement() {
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('role.tanner.announcement')
    );
  }
}
