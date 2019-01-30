/* tslint:disable:no-unused */

import Game from '@game/Game';
import Player from '@game/base/Player';
import * as Types from './RoleTypes';
import GameEventQueue from '@game/GameEventQueue';
import MessageGenerator from '../helper/MessageGenerator';

export default class Role {
  public readonly userId: string;

  public id: Types.RoleId;
  public name: Types.RoleName;

  public dead: boolean;
  public doneAction: boolean;

  protected messageGenerator: MessageGenerator;

  protected readonly game: Game;
  protected readonly player: Player;

  constructor(game: Game, player: Player) {
    this.game = game;
    this.player = player;

    this.userId = player.userId;

    this.id = 'default';
    this.name = 'default';

    this.doneAction = false;
    this.dead = false;

    this.messageGenerator = new MessageGenerator(
      this.game.localeService,
      this.game
    );
  }

  /**
   * eventAnnouncement
   * get called when role is given to player
   */
  public eventAnnouncement() {
    // To be override
  }

  /**
   * action
   * get called when role do specific action
   * Example:
   * wolf is bite, guardian is protecting, etc
   */
  public action(
    event: Types.EventType,
    target: Player,
    eventQueue: GameEventQueue
  ) {
    // To be override
  }

  /**
   * eventDay
   */
  public eventDay() {
    // To be override
  }

  /**
   * eventDusk
   * Send vote selection to all alive players
   */
  public eventDusk() {
    const target = this.game.getVoteList(this.player);
    const message = this.messageGenerator.voteSelection(target);
    this.game.channel.sendTemplateMessage(this.userId, message);
  }

  /**
   * eventNight
   */
  public eventNight() {
    // To be override
  }

  /**
   * eventCallback
   */
  public eventCallback(time: Types.time, event: Types.GameEvent) {
    if (this.doneAction) return;

    this.doneAction = true;

    switch (time) {
      case 'DAY':
        this.eventDayCallback(event);
        break;
      case 'NIGHT':
        this.eventNightCallback(event);
        break;
      case 'DUSK':
        this.eventDuskCallback(event);
        break;
      default:
        break;
    }
  }

  /**
   * eventDayCallback
   */
  public eventDayCallback(event: Types.GameEvent) {
    // To be override
  }

  /**
   * eventNightCallback
   */
  public eventNightCallback(event: Types.GameEvent) {
    this.addEventToQueue(event);
  }

  /**
   * eventDuskCallback
   */
  public eventDuskCallback(event: Types.GameEvent) {
    if (this.dead) return;
    this.addEventToQueue(event);
    const target = this.game.getTargetPlayer(event.targetId);
    this.game.broadcastMessage(this.game.localeService.t('vote.choose'));
  }

  /**
   * addEventToQueue
   */
  public addEventToQueue(event: Types.GameEvent) {
    const target = this.game.getTargetPlayer(event.targetId);
    this.game.eventQueue.add(this.player, target, event.event, 0);
  }

  /**
   * timeUp
   * called when user dont do anything when event called
   */
  public timeUp(time: Types.time) {
    switch (time) {
      case 'DAY':
        break;
      case 'NIGHT':
        break;
      case 'DUSK':
        break;
      default:
        break;
    }
  }

  /**
   * dayTimeUp
   */
  public dayTimeUp() {
    // To be override
  }

  /**
   * nightTimeUp
   */
  public nightTimeUp() {
    // To be override
  }

  /**
   * duskTimeUp
   */
  public duskTimeUp() {
    // To be override
  }
}
