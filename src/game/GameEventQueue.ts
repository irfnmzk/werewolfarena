import Game from './Game';
import EventQueue from './base/EventQueue';
import Player from './base/Player';
import * as Types from './roles/base/RoleTypes';

export default class GameEventQueue {
  public queue: EventQueue[];
  private readonly game: Game;

  constructor(game: Game) {
    this.game = game;
    this.queue = [];
  }

  /**
   * add queue
   */
  public add(user: Player, target: Player, event: string, priority: number) {
    this.queue.push({
      user,
      event,
      target,
      priority
    });
  }

  /**
   * refreshQueue
   */
  public refreshQueue(time: Types.time) {
    this.queue = [];
  }
}
