import Role from './base/Role';
import Game from '@game/Game';
import Player from '@game/base/Player';
import * as Types from './base/RoleTypes';

export default class WereWolf extends Role {
  constructor(game: Game, player: Player) {
    super(game, player);

    this.id = 'wolf';
    this.name = 'Wolf';
  }

  public eventAnnouncement() {
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('role.werewolf.announcement')
    );
  }

  public eventNight() {
    const target = this.game.getEnemyList(this.player);
    const message = this.messageGenerator.werewolfSelection(target);
    this.game.channel.sendTemplateMessage(this.userId, message);
  }

  public eventNightCallback(event: Types.GameEvent) {
    super.eventNightCallback(event);

    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('common.selected.vote')
    );
    const ally = this.game.getAllyList(this.player);
    this.game.channel.sendMultiText(
      ally,
      this.game.localeService.t('common.selected.ally')
    );
  }

  public nightTimeUp() {
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('common.timeup')
    );
  }

  public action(event: Types.EventType, target: Player) {
    switch (event) {
      case 'bite':
        this.game.channel.sendWithText(
          target.userId,
          this.game.localeService.t('role.werewolf.bite')
        );
        target.role!.endOfLife(event, this.player);
    }
  }
}
