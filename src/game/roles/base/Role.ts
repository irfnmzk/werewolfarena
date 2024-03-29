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

  public team: Types.Team;

  public dead: boolean;
  public doneAction: boolean;

  public voteMiss: number;

  public buff: Types.Buff[];
  public roleHistory: Types.RoleId[];

  public actionLeft: number;

  public priority: number;

  public targetPlayer?: Player;

  public inLove: boolean = false;
  public lover?: Player;

  public killCount: number = 0;

  protected messageGenerator: MessageGenerator;

  protected readonly game: Game;
  protected readonly player: Player;

  constructor(game: Game, player: Player) {
    this.game = game;
    this.player = player;

    this.userId = player.userId;

    this.id = 'default';
    this.name = 'default';

    this.priority = 0;
    this.voteMiss = 0;
    this.actionLeft = 0;

    this.team = 'VILLAGER';

    this.doneAction = false;
    this.dead = false;

    this.buff = [];
    this.roleHistory = [];

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
  public action(event: Types.EventType, target: Player) {
    // To be override
  }

  /**
   * firstDayEvent
   */
  public firstDayEvent() {
    // to be override
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
    // this.game.channel.sendTemplateMessage(this.userId, message);
    this.game.channel.sendMultipleTypeMessage(this.userId, [message]);
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
    // cupid byapass action restriction
    if (this.doneAction && this.id !== 'cupid') return;

    this.doneAction = true;

    switch (time) {
      case 'FIRST':
        this.firstDayCallback(event);
        break;
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
   * firstDayCallback
   */
  public firstDayCallback(event: Types.GameEvent) {
    // To be override
  }

  /**
   * eventDayCallback
   */
  public eventDayCallback(event: Types.GameEvent) {
    // To be override
    this.addEventToQueue(event);
  }

  /**
   * eventNightCallback
   */
  public eventNightCallback(event: Types.GameEvent) {
    // Skip queue on extended time
    if (this.game.extendedTime !== 0) {
      return this.game.extendedTimeAction(
        this.player,
        event.targetId,
        event.event
      );
    }

    this.addEventToQueue(event);
  }

  /**
   * eventDuskCallback
   */
  public eventDuskCallback(event: Types.GameEvent) {
    if (this.dead || event.event !== 'vote') return;
    this.addEventToQueue(event);
    const target = this.game.getTargetPlayer(event.targetId);
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('common.selected.self', {
        target: target.name
      })
    );
    this.game.broadcastTextMessage(
      this.game.localeService.t('common.selected.vote', {
        user: this.player.name,
        target: target.name
      })
    );
  }

  /**
   * addEventToQueue
   */
  public addEventToQueue(event: Types.GameEvent) {
    const target = this.game.getTargetPlayer(event.targetId);
    this.game.eventQueue.add(
      this.player,
      target,
      event.event,
      this.player.role!.priority
    );
  }

  /**
   * timeUp
   * called when user dont do anything when event called
   */
  public timeUp(time: Types.time) {
    switch (time) {
      case 'DAY':
        this.dayTimeUp();
        break;
      case 'NIGHT':
        this.nightTimeUp();
        break;
      case 'DUSK':
        this.duskTimeUp();
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
    this.game.channel.sendWithText(
      this.userId,
      this.game.localeService.t('common.timeup')
    );
    if (this.voteMiss++ === this.game.maxVoteMiss) this.votePunishment();
  }

  /**
   * endOfLife
   */
  public endOfLife(event: Types.EventType, killer: Player) {
    this.dead = true;

    // Kill another player if this player shipped by cupid
    if (this.inLove) {
      this.lover!.role!.suicideForLove(this.player);
    }
    this.game.eventQueue.addDeath(event, this.player, killer);
  }

  /**
   * suicideForLove
   */
  public suicideForLove(killer: Player) {
    this.dead = true;
    this.game.eventQueue.addDeath('suicide', this.player, killer);
  }

  /**
   * addBuff
   */
  public addBuff(buff: Types.Buff) {
    this.buff.push(buff);
  }

  /**
   * hasBuff
   */
  public hasBuff(name: Types.BuffName) {
    return this.buff.filter(data => data.name === name).length >= 1;
  }

  /**
   * resetBuff
   */
  public resetBuff() {
    this.buff = [];
  }

  /**
   * updateBuff
   */
  public updateBuff() {
    this.buff = this.buff
      .filter(item => item.duration !== 1)
      .map(
        item =>
          ({ duration: item.duration -= 1, name: item.name } as Types.Buff)
      );
  }

  /**
   * revivePlayer
   */
  public revivePlayer() {
    this.dead = false;

    this.game.channel.sendWithText(
      this.userId,
      'Kamu telah di hidupkan kembali'
    );
  }

  /**
   * changeTeam
   */
  public changeTeam(team: Types.Team) {
    this.team = team;
  }

  protected setRoleHistory(role: Types.RoleId) {
    this.roleHistory.push(role);
  }

  private votePunishment() {
    this.endOfLife('punishment', {} as Player);
  }
}
