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

    console.log('process queue');

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
  }

  /**
   * getAllDeath
   */
  public getAllDeath() {
    return this.death;
  }

  private processVote() {
    console.log(`process vote start`);
    const voteCounter: VoteCounter = this.queue.reduce(
      (prev, { target: { userId } }) => {
        prev[userId] ? (prev[userId] += 1) : (prev[userId] = 1);
        return prev;
      },
      {} as VoteCounter
    );

    console.log('process vote 1 - ', voteCounter);

    // Need to be refactor in functional way
    let found = false;
    let maxCount = 0;
    let targetUserId = '';
    for (const userId in voteCounter) {
      if (voteCounter[userId] > maxCount) {
        maxCount = voteCounter[userId];
        found = true;
        targetUserId = userId;
      } else if (voteCounter[userId] === maxCount) {
        found = false;
      }
    }

    console.log('process vote - 2', found, targetUserId, maxCount);

    if (!found) return;

    console.log('player ' + targetUserId);

    this.game
      .getTargetPlayer(targetUserId)
      .role!.endOfLife('vote', {} as Player);
  }

  private combineQueue() {
    // TODO
  }
}
