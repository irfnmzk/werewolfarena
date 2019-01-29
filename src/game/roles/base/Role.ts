import Game from '@game/Game';
import Player from '@game/base/Player';
import * as Types from './RoleTypes';

export default class Role {
  public readonly userId: string;

  public id: Types.RoleId;
  public name: Types.RoleName;

  protected readonly game: Game;
  private readonly player: Player;

  constructor(game: Game, player: Player) {
    this.game = game;
    this.player = player;

    this.userId = player.userId;

    this.id = 'default';
    this.name = 'default';
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
  public action() {
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
   */
  public eventDusk() {
    // To be override
  }

  /**
   * eventNight
   */
  public eventNight() {
    // To be override
  }

  /**
   * processCallback
   */
  public processCallback(time: Types.time) {
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
   * eventDayCallback
   */
  public eventDayCallback() {
    // To be override
  }

  /**
   * eventNightCallback
   */
  public eventNightCallback() {
    // To be override
  }

  /**
   * eventDuskCallback
   */
  public eventDuskCallback() {
    // To be override
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
