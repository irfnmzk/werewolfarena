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

    if (this.isVote) return this.processVote();

    this.combineQueue();

    this.queue = _.sortBy(this.queue, data => -data.priority);
    this.queue
      .filter(data => !data.user.role!.dead)
      .forEach(data => {
        // Double Chceck
        if (data.user.role!.dead) return;
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
    const voteCounter: VoteCounter = this.queue.reduce(
      (prev, { target: { userId } }) => {
        prev[userId] ? (prev[userId] += 1) : (prev[userId] = 1);
        return prev;
      },
      {} as VoteCounter
    );

    const targetUserId = Object.keys(voteCounter).reduce((prev, curr) =>
      voteCounter[prev] > voteCounter[curr] ? prev : curr
    );

    const found = Object.keys(voteCounter).filter(
      key => voteCounter[key] === voteCounter[targetUserId]
    );
    if (found.length !== 1) {
      return;
    }

    this.game
      .getTargetPlayer(targetUserId)
      .role!.endOfLife('vote', {} as Player);
  }

  private combineQueue() {
    const eventList: Types.EventType[] = ['bite'];
    eventList.forEach(event => {
      const eventCount = this.queue.filter(data => data.event === event).length;
      if (eventCount <= 0) return;
      if (eventCount <= 2) {
        if (eventCount === 1) {
          return;
        }
        this.queue = this.queue.filter(
          item =>
            this.queue.filter(data => data.event === event)[1].target.userId !==
            item.target.userId
        );
        return;
      }

      const userCounter: VoteCounter = this.queue.reduce(
        (prev, { target: { userId } }) => {
          prev[userId] ? (prev[userId] += 1) : (prev[userId] = 1);
          return prev;
        },
        {} as VoteCounter
      );

      const targetUserId = Object.keys(userCounter).reduce((prev, curr) =>
        userCounter[prev] > userCounter[curr] ? prev : curr
      );

      this.queue = this.queue.filter(item => {
        return item.target.userId === targetUserId || item.event !== event;
      });
    });
  }
}
