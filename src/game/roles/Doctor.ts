import Role from './base/Role';
import Game from '@game/Game';
import Player from '@game/base/Player';
import * as Types from './base/RoleTypes';

export default class Doctor extends Role {
  constructor(game: Game, player: Player) {
    super(game, player);

    this.priority = 1;
    this.actionLeft = 1;

    this.id = 'doctor';
    this.name = 'Doctor';

    this.setRoleHistory(this.id);
  }

  public eventAnnouncement() {
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('role.doctor.announcement')
    );
  }

  public eventNight() {
    if (this.actionLeft <= 0) return;

    const target = this.game.getAllDeadPlayers(this.player);
    const message = this.messageGenerator.doctorSelection(target);
    if (target.length > 0) {
      this.game.channel.sendMultipleTypeMessage(this.userId, [message]);
    }
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
    if (this.game.getAllDeadPlayers(this.player).length <= 0) return;
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('common.timeup')
    );
  }

  public action(event: Types.EventType, target: Player) {
    if (event !== 'revive' || this.actionLeft <= 0) return;
    this.actionLeft--;

    this.game.broadcastTextMessage(
      this.game.localeService.t('role.doctor.revived', {
        target: target.name
      })
    );

    target.role!.revivePlayer();
  }
}
