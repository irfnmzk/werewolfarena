import _ from 'lodash';
import Game from './Game';
import EventQueue from './base/EventQueue';
import Player from './base/Player';
import * as Types from './roles/base/RoleTypes';

interface VoteCounter {
  [key: string]: number;
}

export default class GameEventQueue {
  public queue: EventQueue[];
  public death: any[];
  public deadPlayers: Player[];

  private readonly game: Game;
  private isVote: boolean;

  constructor(game: Game) {
    this.game = game;
    this.queue = [];
    this.death = [];
    this.deadPlayers = [];

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
    this.death = [];
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
        data.user.role!.action(data.event, data.target);
      });
  }

  /**
   * addDeath
   */
  public addDeath(event: Types.EventType, player: Player, killer: Player) {
    this.death.push({
      event,
      player,
      killer
    });
    this.deadPlayers.push(player);

    console.log(this.death);
  }

  /**
   * getAllDeath
   */
  public getAllDeath() {
    return this.death;
  }

  private processVote() {
    const voteCounter: VoteCounter = this.queue.reduce(
      (prev, curr) => {
        prev[curr.target.userId] += 1;
        return prev;
      },
      {} as VoteCounter
    );
    console.log(voteCounter);
  }

  private combineQueue() {
    // TODO
  }
}
