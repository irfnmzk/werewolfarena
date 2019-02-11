import Role from './base/Role';
import Game from '@game/Game';
import Player from '@game/base/Player';
import * as Types from './base/RoleTypes';

export default class Guardian extends Role {
  constructor(game: Game, player: Player) {
    super(game, player);

    this.priority = 3;

    this.id = 'guardian';
    this.name = 'Guardian';

    this.setRoleHistory(this.id);
  }

  public eventAnnouncement() {
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('role.guardian.announcement')
    );
  }

  public eventNight() {
    const target = this.game.getAlivePlayer();
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
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('common.timeup')
    );
  }

  public action(event: Types.EventType, target: Player) {
    if (event !== 'protect') return;
    target.role!.addBuff({ name: 'protected', duration: 1 });
  }
}
