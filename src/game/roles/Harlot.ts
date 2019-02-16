import Role from './base/Role';
import Game from '@game/Game';
import Player from '@game/base/Player';
import * as Types from './base/RoleTypes';

export default class Harlot extends Role {
  constructor(game: Game, player: Player) {
    super(game, player);

    this.priority = 4;

    this.id = 'harlot';
    this.name = 'Harlot';

    this.setRoleHistory(this.id);
  }

  public eventAnnouncement() {
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('role.harlot.announcement')
    );
  }

  public eventNight() {
    const target = this.game.getEnemyList(this.player);
    const message = this.messageGenerator.harlotSelection(target);
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
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('common.timeup')
    );
  }

  public action(event: Types.EventType, target: Player) {
    if (event !== 'visit') return;
    target.role!.addBuff({ name: 'visited', duration: 1 });
    this.player.role!.addBuff({ name: 'visiting', duration: 1 });
    this.targetPlayer = target;
  }
}
