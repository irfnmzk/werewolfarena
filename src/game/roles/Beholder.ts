import Role from './base/Role';
import Game from '@game/Game';
import Player from '@game/base/Player';

export default class Beholder extends Role {
  constructor(game: Game, player: Player) {
    super(game, player);

    this.id = 'beholder';
    this.name = 'Beholder';

    this.setRoleHistory(this.id);
  }

  public eventAnnouncement() {
    const target = this.game.players.find(data => data.role!.id === 'seer');

    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t(`role.beholder.announcement`, {
        target: target!.name
      })
    );
  }
}
