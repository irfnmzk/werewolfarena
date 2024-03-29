import Role from './base/Role';
import Game from '@game/Game';
import Player from '@game/base/Player';
import * as Types from './base/RoleTypes';

export default class WereWolf extends Role {
  constructor(game: Game, player: Player) {
    super(game, player);

    this.priority = 2;

    this.id = 'werewolf';
    this.name = 'Werewolf';

    this.team = 'WEREWOLF';

    this.setRoleHistory(this.id);
  }

  public eventAnnouncement() {
    const allyListName = this.game
      .getTeamList(this.player)
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
        // Abort if target already dead by another role
        if (target.role!.dead) return;

        // Bite fail if guardian protect the target
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

        // Bite fail if harlot is visiting someone
        if (target.role!.hasBuff('visiting')) {
          return this.game.channel.sendWithText(
            this.userId,
            this.game.localeService.t('role.harlot.fail_bite')
          );
        }

        // 2 player die if harlot visiting someone and got bite
        if (target.role!.hasBuff('visited')) {
          const targetList: Player[] = [];
          targetList.push(target);
          this.game!.getAlivePlayerByRole('harlot').forEach(item => {
            if (!item.role!.targetPlayer) return;
            if (item.role!.targetPlayer!.userId === target.userId) {
              targetList.push(item);
            }
          });
          return targetList.forEach(item => {
            this.game.channel.sendWithText(
              item.userId,
              this.game.localeService.t(
                item.role!.id === 'harlot'
                  ? 'role.harlot.die_while_visit'
                  : 'role.werewolf.bite'
              )
            );
            item.role!.endOfLife('bite', this.player);
          });
        }
        if (target.role!.id === 'drunk') {
          this.game.channel.sendWithText(
            this.userId,
            this.game.localeService.t('role.werewolf.eat_drunk')
          );
        }

        // Skip notify target for certain role
        const excludeRole: [Types.RoleName] = ['Hunter'];
        if (!excludeRole.includes(target.role!.name)) {
          this.game.channel.sendWithText(
            target.userId,
            this.game.localeService.t('role.werewolf.bite')
          );
        }
        this.killCount++;
        target.role!.endOfLife(event, this.player);
    }
  }

  public endOfLife(event: Types.EventType, killer: Player) {
    super.endOfLife(event, killer);

    if (!this.isLastWolf()) return;
    this.game
      .getAlivePlayer()
      .filter(player => player.role!.id === 'traitor')
      .forEach(player => this.game.transformPlayerRole(player, 'werewolf'));
  }

  private isLastWolf() {
    return (
      this.game.players.filter(
        player => player.role!.id === 'werewolf' && !player.role!.dead
      ).length === 0
    );
  }
}
