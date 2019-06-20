import Role from './base/Role';
import Game from '@game/Game';
import Player from '@game/base/Player';
import * as Types from './base/RoleTypes';

export default class Hunter extends Role {
  public HUNTER_EXTEND_DURATION = 20;

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

  public eventNightCallback(event: Types.GameEvent) {
    super.eventNightCallback(event);

    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('common.selected.self', {
        target: this.game.getTargetPlayer(event.targetId).name
      })
    );
  }

  public action(event: Types.EventType, target: Player) {
    if (event !== 'revenge') return;
    this.killCount++;
    this.game.channel.sendWithText(
      target.userId,
      this.game.localeService.t('role.hunter.revenge')
    );

    target.role!.endOfLife(event, this.player);
  }

  public endOfLife(event: Types.EventType, killer: Player) {
    super.endOfLife(event, killer);

    if (event !== 'bite') return;
    this.game.extendedTime = this.HUNTER_EXTEND_DURATION;

    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t(`role.hunter.die`, {
        time: this.HUNTER_EXTEND_DURATION
      })
    );

    setTimeout(() => {
      const target = this.game.getEnemyList(this.player);
      const message = this.messageGenerator.hunterSelection(target);
      this.game.channel.sendMultipleTypeMessage(this.userId, [message]);
    }, 1000);
  }
}
