import Role from './base/Role';
import Game from '@game/Game';
import Player from '@game/base/Player';
import * as Types from './base/RoleTypes';
import { FlexMessage } from '@line/bot-sdk';

export default class Cupid extends Role {
  public loverTarget: {
    targetOne?: Player;
    targetTwo?: Player;
  };

  constructor(game: Game, player: Player) {
    super(game, player);

    this.priority = 10;
    this.actionLeft = 2;

    this.loverTarget = { targetOne: undefined, targetTwo: undefined };

    this.id = 'cupid';
    this.name = 'Cupid';

    this.setRoleHistory(this.id);
  }

  public eventAnnouncement() {
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('role.cupid.announcement')
    );
  }

  public eventNight() {
    let message: FlexMessage;
    const target = this.game.getAlivePlayer();

    switch (this.actionLeft) {
      case 2:
        message = this.messageGenerator.cupidSelectionOne(target);
        break;
      case 1:
        message = this.messageGenerator.cupidSelectionTwo(target);
        break;
      default:
        return;
    }

    this.game.channel.sendMultipleTypeMessage(this.userId, [message]);
  }

  public eventNightCallback(event: Types.GameEvent) {
    super.eventNightCallback(event);

    if (event.event !== 'cupid') return;
    this.actionLeft--;

    const target = this.game.getTargetPlayer(event.targetId);

    if (!this.loverTarget.targetOne) {
      target.role!.inLove = true;
      this.loverTarget.targetOne = target;
      this.eventNight();
    } else {
      target.role!.inLove = true;
      target.role!.lover = this.loverTarget.targetOne;
      this.loverTarget.targetTwo = target;
      this.loverTarget.targetOne.role!.lover = target;
    }

    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('common.selected.self', {
        target: target.name
      })
    );

    if (this.loverTarget.targetOne && this.loverTarget.targetTwo) return;
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('role.cupid.ship', {
        target1: this.loverTarget.targetOne!.name,
        target2: this.loverTarget.targetTwo!.name
      })
    );
  }
}
