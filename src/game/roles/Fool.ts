import Role from './base/Role';
import Game from '@game/Game';
import Player from '@game/base/Player';
import * as Types from './base/RoleTypes';

export default class Seer extends Role {
  constructor(game: Game, player: Player) {
    super(game, player);

    this.priority = 1;

    this.id = 'fool';
    this.name = 'Fool';

    this.setRoleHistory(this.id);
  }

  public eventAnnouncement() {
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('role.seer.announcement')
    );
  }

  public eventNight() {
    const target = this.game.getEnemyList(this.player);
    const message = this.messageGenerator.seerSelection(target);
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
    if (event !== 'see') return;
    const randomRoles: string = this.game.players
      .filter(
        player =>
          player.role!.id !== this.game.getTargetPlayer(target.userId).role!.id
      )
      .map(
        player => player.role!.name
        // Refactor this!
      )[this.getRendomInRange(0, this.game.players.length - 2)];
    const targetRole =
      Math.random() >= 0.5
        ? this.game.getTargetPlayer(target.userId).role!.name
        : randomRoles;
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('role.seer.see', {
        target: this.game.getTargetPlayer(target.userId).name,
        role: targetRole
      })
    );
  }

  private getRendomInRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
