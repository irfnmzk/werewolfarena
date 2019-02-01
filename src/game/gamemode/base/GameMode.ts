// tslint:disable:no-unused
import RolesFactory from './RolesFactory';
import { Roles } from './Role';
import Player from '../../base/Player';
import Game from '../../Game';

export default class GameMode {
  public name?: string;

  public MIN_PLAYER?: number;
  public MAX_PLAYER?: number;

  protected readonly roleFactory = RolesFactory;
  protected readonly game: Game;

  protected readonly allRoles: Roles[];
  protected requiredRole: Roles[];

  constructor(game: Game) {
    this.game = game;
    this.allRoles = Object.keys(this.roleFactory).map(data => data) as Roles[];
    this.requiredRole = [];
  }

  /**
   * assignRoles
   */
  public assignRoles(player: Player[]) {
    // To be override
  }
}
