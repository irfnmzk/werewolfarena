import Role from './base/Role';
import Game from '@game/Game';
import Player from '@game/base/Player';
import * as Types from './base/RoleTypes';

export default class WereWolf extends Role {
  constructor(game: Game, player: Player) {
    super(game, player);

    this.priority = 2;

    this.id = 'wolf';
    this.name = 'Wolf';

    this.team = 'WEREWOLF';
  }

  public eventAnnouncement() {
    const allyListName = this.game
      .getAllyList(this.player)
      .map(ally => ally.name)
      .join(', ');
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('role.werewolf.announcement', {
        ally:
          allyListName.length > 0
            ? allyListName + this.game.localeService.t('role.werewolf.friend')
            : this.game.localeService.t('role.werewolf.alone')
      })
    );
  }

  public eventNight() {
    if (this.hasBuff('drunk')) {
      return this.game.channel.sendWithText(
        this.userId,
        this.game.localeService.t('role.drunk.cant_bite')
      );
    }
    const target = this.game.getEnemyList(this.player);
    const message = this.messageGenerator.werewolfSelection(target);
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
    const ally = this.game.getAllyList(this.player);
    this.game.channel.sendMultiText(
      ally,
      this.game.localeService.t('common.selected.ally', {
        user: this.player.name,
        target: this.game.getTargetPlayer(event.targetId).name
      })
    );
  }

  public nightTimeUp() {
    if (this.hasBuff('drunk')) return;
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('common.timeup')
    );
  }

  public action(event: Types.EventType, target: Player) {
    if (this.hasBuff('drunk')) return;
    switch (event) {
      case 'bite':
        if (target.role!.hasBuff('protected')) {
          this.game.channel.sendWithText(
            this.userId,
            this.game.localeService.t('role.guardian.fail_bite')
          );
          this.game.channel.sendWithText(
            this.game.groupId,
            this.game.localeService.t('role.guardian.succes_protect')
          );
          return;
        }
        if (target.role!.id === 'drunk') {
          this.game.channel.sendWithText(
            this.userId,
            this.game.localeService.t('role.werewolf.eat_drunk')
          );
        }
        this.game.channel.sendWithText(
          target.userId,
          this.game.localeService.t('role.werewolf.bite')
        );
        target.role!.endOfLife(event, this.player);
    }
  }
}
