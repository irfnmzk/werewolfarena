import Role from './base/Role';
import Game from '@game/Game';
import Player from '@game/base/Player';
import * as Types from '../roles/base/RoleTypes';

export default class Cursed extends Role {
  constructor(game: Game, player: Player) {
    super(game, player);

    this.id = 'cursed';
    this.name = 'Cursed';

    this.setRoleHistory(this.id);
  }

  public eventAnnouncement() {
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('role.cursed.announcement')
    );
  }

  public endOfLife(event: Types.EventType, killer: Player) {
    if (event !== 'bite') return super.endOfLife(event, killer);
    if (killer.role!.id !== 'werewolf') return super.endOfLife(event, killer); // Got error if dead by vote
    const wolfList = this.game
      .getAllyList(this.player)
      .filter(({ role }) => role!.id === 'werewolf');
    this.game.channel.sendMultiText(
      wolfList,
      this.game.localeService.t('role.werewolf.new_member', {
        player: this.player.name
      })
    );
    return this.game.transformPlayerRole(this.player, 'werewolf');
  }
}
