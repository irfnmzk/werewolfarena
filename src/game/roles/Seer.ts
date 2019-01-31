import Role from './base/Role';
import Game from '@game/Game';
import Player from '@game/base/Player';
import * as Types from './base/RoleTypes';

export default class Seer extends Role {
  constructor(game: Game, player: Player) {
    super(game, player);

    this.priority = 1;

    this.id = 'seer';
    this.name = 'Seer';
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
    this.game.channel.sendTemplateMessage(this.userId, message);
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
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('role.seer.see', {
        target: this.game.getTargetPlayer(target.userId).name,
        role: this.game.getTargetPlayer(target.userId).role!.name
      })
    );
  }
}
