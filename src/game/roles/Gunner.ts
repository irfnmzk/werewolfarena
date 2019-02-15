import Role from './base/Role';
import Game from '@game/Game';
import Player from '@game/base/Player';
import * as Types from './base/RoleTypes';

export default class Gunner extends Role {
  constructor(game: Game, player: Player) {
    super(game, player);

    this.priority = 4;
    this.actionLeft = 2;

    this.id = 'gunner';
    this.name = 'Gunner';

    this.setRoleHistory(this.id);
  }

  public eventAnnouncement() {
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('role.gunner.announcement')
    );
  }

  public eventNight() {
    if (this.actionLeft <= 0) {
      return this.game.channel.sendWithText(
        this.userId,
        this.game.localeService.t('role.gunner.no_action')
      );
    }
    const target = this.game.getEnemyList(this.player);
    const message = this.messageGenerator.guardianSelection(target);
    this.game.channel.sendMultipleTypeMessage(this.userId, [message]);
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

  public nightTimeUp() {
    if (this.actionLeft === 0) return;
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('common.timeup')
    );
  }

  public action(event: Types.EventType, target: Player) {
    if (event !== 'shoot' || this.actionLeft <= 0) return;
    this.actionLeft -= 1;
    this.game.channel.sendWithText(
      target.userId,
      this.game.localeService.t('role.gunner.shooted')
    );
    this.game.broadcastTextMessage(
      this.game.localeService.t('role.gunner.shoot')
    );
    target.role!.endOfLife('shoot', this.player);
  }
}
