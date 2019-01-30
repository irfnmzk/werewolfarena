import Role from './base/Role';
import Game from '@game/Game';
import Player from '@game/base/Player';

import * as messageGenerator from './helper/MessageGenerator';

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
    const message = messageGenerator.werewolfSelection(target);
    console.log('night event ww', target);
  }
}
