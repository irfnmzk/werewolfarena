import Role from './base/Role';
import Game from '@game/Game';
import Player from '@game/base/Player';

export default class LumberJack extends Role {
  constructor(game: Game, player: Player) {
    super(game, player);

    this.id = 'lumberjack';
    this.name = 'Lumberjack';

    this.setRoleHistory(this.id);
  }

  public eventAnnouncement() {
    const allyListName = this.game
      .getAllyList(this.player)
      .map(ally => ally.name)
      .join(', ');

    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('role.lumberjack.announcement', {
        ally:
          allyListName.length > 0
            ? allyListName + this.game.localeService.t('role.lumberjack.friend')
            : this.game.localeService.t('role.lumberjack.alone')
      })
    );
  }
}
