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

  public firstDayEvent() {
    let message: FlexMessage;
    const target = this.game
      .getAlivePlayer()
      .filter(player => !player.role!.inLove);

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

  public firstDayCallback(event: Types.GameEvent) {
    if (event.event !== 'cupid') return;
    this.actionLeft--;

    const target = this.game.getTargetPlayer(event.targetId);

    if (!this.loverTarget.targetOne) {
      target.role!.inLove = true;
      this.loverTarget.targetOne = target;
      this.timeout(() => this.firstDayEvent(), 1000);
    } else {
      target.role!.inLove = true;
      target.role!.lover = this.loverTarget.targetOne;
      this.loverTarget.targetTwo = target;
      this.loverTarget.targetOne.role!.lover = target;
      this.game.channel.sendWithText(
        this.loverTarget.targetOne!.userId,
        this.game.localeService.t('role.cupid.shipped')
      );
      this.game.channel.sendWithText(
        this.loverTarget.targetTwo!.userId,
        this.game.localeService.t('role.cupid.shipped')
      );
    }

    this.timeout(
      () =>
        this.game.channel.sendWithText(
          this.userId,
          this.game.localeService.t('common.selected.self', {
            target: target.name
          })
        ),
      500
    );

    if (!this.loverTarget.targetOne || !this.loverTarget.targetTwo) return;
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('role.cupid.ship', {
        target1: this.loverTarget.targetOne!.name,
        target2: this.loverTarget.targetTwo!.name
      })
    );
  }

  private timeout(cb: any, ms: number) {
    return new Promise(resolve =>
      setTimeout(() => {
        resolve(cb());
      }, ms)
    );
  }
}
