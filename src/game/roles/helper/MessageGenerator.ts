import _ from 'lodash';
import * as Line from '@line/bot-sdk';
import Player from '@game/base/Player';
import LocaleService from '../../../utils/i18n/LocaleService';
import Game from '@game/Game';
import generateEvent from './EventGenerator';

export default class MessageGenerator {
  private readonly localeService: LocaleService;
  private readonly game: Game;

  constructor(localeService: LocaleService, game: Game) {
    this.localeService = localeService;
    this.game = game;
  }

  /**
   * werewolfSelction
   */
  public werewolfSelection(target: Player[]) {
    const results: Line.TemplateMessage[] = [];
    const chunkFour = _.chunk(target, 4);
    chunkFour.forEach(four => {
      const messageAction: Line.Action[] = [];
      four.forEach(item => {
        const postBackData = generateEvent({
          type: 'GAME_EVENT',
          data: {
            event: 'bite',
            groupId: this.game.groupId,
            targetId: item.userId
          }
        });
        messageAction.push({
          type: 'postback',
          data: postBackData,
          label: item.name
        });
      });
      results.push({
        type: 'template',
        altText: this.localeService.t('role.werewolf.selection'),
        template: {
          type: 'buttons',
          text: this.localeService.t('role.werewolf.selection'),
          actions: messageAction as Line.Action[]
        }
      });
    });
    return results;
  }

  /**
   * voteSelection
   */
  public voteSelection(target: Player[]) {
    const results: Line.TemplateMessage[] = [];
    const chunkFour = _.chunk(target, 4);
    chunkFour.forEach(four => {
      const messageAction: Line.Action[] = [];
      four.forEach(item => {
        const postBackData = generateEvent({
          type: 'GAME_EVENT',
          data: {
            event: 'vote',
            groupId: this.game.groupId,
            targetId: item.userId
          }
        });
        messageAction.push({
          type: 'postback',
          data: postBackData,
          label: item.name
        });
      });
      results.push({
        type: 'template',
        altText: this.localeService.t('vote.selection'),
        template: {
          type: 'buttons',
          text: this.localeService.t('vote.selection'),
          actions: messageAction
        }
      });
    });
    return results;
  }
}
