import Role from './base/Role';
import Game from '@game/Game';
import Player from '@game/base/Player';
import * as Types from '../roles/base/RoleTypes';

export default class Drunk extends Role {
  constructor(game: Game, player: Player) {
    super(game, player);

    this.id = 'drunk';
    this.name = 'Drunk';
  }

  public eventAnnouncement() {
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('role.drunk.announcement')
    );
  }

  public endOfLife(event: Types.EventType, killer: Player) {
    super.endOfLife(event, killer);

    if (event !== 'bite' && killer.role!.id !== 'wolf') return;
    killer.role!.addBuff({ name: 'drunk', duration: 2 });
  }
}
