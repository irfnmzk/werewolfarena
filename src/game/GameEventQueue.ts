import Game from './Game';
import EventQueue from './base/EventQueue';
import Player from './base/Player';

export default class GameEventQueue {
  public queue: EventQueue[];
  private readonly game: Game;

  constructor(game: Game) {
    this.game = game;
    this.queue = [];
  }

  /**
   * add
   */
  public add(user: Player, event: string, priority: number) {
    this.queue.push({
      user,
      event,
      userId: user.userId,
      priority
    });
  }
}
