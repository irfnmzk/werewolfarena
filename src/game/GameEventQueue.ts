import _ from 'lodash';
import Game from './Game';
import EventQueue from './base/EventQueue';
import Player from './base/Player';
import * as Types from './roles/base/RoleTypes';

export default class GameEventQueue {
  public queue: EventQueue[];
  private readonly game: Game;
  private isVote: boolean;

  constructor(game: Game) {
    this.game = game;
    this.queue = [];

    this.isVote = false;
  }

  /**
   * add queue
   */
  public add(
    user: Player,
    target: Player,
    event: Types.EventType,
    priority: number
  ) {
    this.queue.push({
      user,
      event,
      target,
      priority
    });

    console.log(this.queue.length);
  }

  /**
   * refreshQueue
   */
  public refreshQueue(time: Types.time) {
    this.isVote = time === 'DUSK';
    this.queue = [];
  }

  /**
   * execute
   */
  public execute() {
    if (!this.queue[0]) return;

    if (this.isVote) return this.processVote();

    this.combineQueue();

    this.queue = _.sortBy(this.queue, data => data.priority);
    this.queue
      .filter(data => !data.user.role!.dead)
      .forEach(data => {
        data.user.role!.action(data.event, data.target, this);
      });
  }

  private processVote() {
    // TODO
  }

  private combineQueue() {
    // TODO
  }
}
