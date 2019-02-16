import Role from './base/Role';
import Game from '@game/Game';
import Player from '@game/base/Player';
import * as Types from './base/RoleTypes';

export default class Hunter extends Role {
  public HUNTER_EXTEND_DURATION = 15;

  constructor(game: Game, player: Player) {
    super(game, player);

    this.priority = 3;

    this.id = 'hunter';
    this.name = 'Hunter';

    this.setRoleHistory(this.id);
  }

  public eventAnnouncement() {
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('role.hunter.announcement')
    );
  }

  public endOfLife(event: Types.EventType, killer: Player) {
    super.endOfLife(event, killer);

    if (event !== 'bite') return;
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t(`role.hunter.die`)
    );

    const target = this.game.getEnemyList(this.player);
    const message = this.messageGenerator.werewolfSelection(target);
    this.game.channel.sendMultipleTypeMessage(this.userId, [message]);
    this.game.extendedTime = this.HUNTER_EXTEND_DURATION;
  }
}
