// tslint:disable:no-unused
import RolesFactory from './RolesFactory';
import { Roles } from './Role';
import Player from '../../base/Player';
import Game from '../../Game';
import Role from '@game/roles/base/Role';
import { RoleId } from '@game/roles/base/RoleTypes';
import RolesGenerator from './RolesGenerator';

interface IrequiredRole {
  [key: string]: any;
}

export default class GameMode {
  public name?: string;

  public MIN_PLAYER?: number;
  public MAX_PLAYER?: number;
  public deck: { [key: string]: number };

  protected readonly roleGenerator: RolesGenerator;
  protected readonly roleFactory: { [key: string]: Role };
  protected readonly game: Game;

  protected readonly allRoles: Roles[];
  protected requiredRole?: IrequiredRole;

  constructor(game: Game) {
    this.game = game;
    this.roleFactory = RolesFactory;
    this.allRoles = Object.keys(this.roleFactory).map(data => data) as Roles[];
    this.roleGenerator = new RolesGenerator();
    this.deck = {};
  }

  /**
   * assignRoles
   */
  public assignRoles(player: Player[]) {
    // To be override
  }

  /**
   * getRandomCount
   */
  public getRandomCount(base = 0, max = 1) {
    return Math.floor(Math.random() * (max + 1 - base) + base);
  }

  /**
   * getNewRole
   */
  public getNewRole(role: RoleId, game: Game, player: Player) {
    const roles = this.capitalized(role);
    return new RolesFactory[roles](game, player);
  }

  /**
   * generateDeck
   */
  public generateDeck(deck: { [key: string]: number }) {
    return this.roleGenerator.createDeck(deck);
  }

  private capitalized(data: string) {
    return data.charAt(0).toUpperCase() + data.slice(1);
  }
}
