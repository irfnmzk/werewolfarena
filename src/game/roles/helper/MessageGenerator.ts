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
   * getDefaultText
   */
  public getDefaultText(text: string): Line.TextMessage {
    return {
      text,
      type: 'text'
    };
  }

  /**
   * joinMessage
   */
  public joinMessage() {
    // Need to be refactored
    const results: Line.FlexMessage = {
      type: 'flex',
      altText: 'Hello',
      contents: {
        type: 'bubble',
        styles: {
          header: {
            backgroundColor: '#36435e'
          },
          footer: {
            // backgroundColor: '#36435e'
          }
        },
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '📣 Permainan Dibuat!',
              size: 'lg',
              weight: 'bold',
              color: '#ffffff'
            }
          ]
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: 'Game Mode',
                  align: 'start',
                  color: '#aaaaaa',
                  flex: 3
                },
                {
                  type: 'text',
                  text: 'Normal',
                  align: 'start',
                  color: '#aaaaaa',
                  weight: 'bold',
                  flex: 1
                }
              ]
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: 'Min: 5',
                  align: 'start',
                  color: '#aaaaaa',
                  flex: 3
                },
                {
                  type: 'text',
                  text: 'Max: 12',
                  align: 'start',
                  color: '#aaaaaa',
                  flex: 1
                }
              ]
            },
            {
              type: 'text',
              text: '⏳ Game Akan di mulai dalam 2 menit',
              size: 'sm',
              margin: 'lg',
              wrap: true
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'button',
              style: 'primary',
              color: '#36435e',
              action: {
                type: 'postback',
                label: 'Bergabung',
                data: generateEvent({
                  type: 'WEREWOLF_JOIN_EVENT'
                })
              },
              flex: 1
            }
          ]
        }
      }
    };

    return results;
  }

  /**
   * playerJoinMessage
   */
  public playerJoinMessage(): Line.FlexMessage {
    const playerList: Line.FlexBox[] = this.game.players.map(
      (player, index): Line.FlexBox => ({
        type: 'box',
        layout: 'horizontal',
        contents: [
          {
            type: 'text',
            text: `${index + 1}`,
            color: '#aaaaaa',
            flex: 2,
            size: 'sm',
            align: 'start'
          },
          {
            type: 'text',
            text: player.name,
            color: '#aaaaaa',
            flex: 4,
            size: 'sm',
            align: 'start'
          }
        ]
      })
    );
    return {
      type: 'flex',
      altText: 'Daftar Pemain',
      contents: {
        type: 'bubble',
        styles: {
          header: {
            backgroundColor: '#36435e'
          },
          footer: {
            // backgroundColor: '#36435e'
          }
        },
        header: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '📣 Daftar Pemain',
              size: 'lg',
              weight: 'bold',
              color: '#ffffff'
            }
          ]
        },
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            // Header row
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: 'No',
                  color: '#aaaaaa',
                  flex: 1,
                  size: 'sm',
                  weight: 'bold',
                  align: 'start'
                },
                {
                  type: 'text',
                  text: 'Nama',
                  color: '#aaaaaa',
                  flex: 4,
                  size: 'sm',
                  weight: 'bold',
                  align: 'center'
                }
              ]
            },
            {
              type: 'separator',
              color: '#36435e'
            },
            // Player list start here
            {
              type: 'box',
              layout: 'vertical',
              margin: 'lg',
              contents: [...playerList]
            },
            {
              type: 'separator',
              color: '#36435e',
              margin: 'md'
            },
            // Min and max player
            {
              type: 'box',
              layout: 'horizontal',
              margin: 'lg',
              contents: [
                {
                  type: 'text',
                  text: `Min: 5`,
                  align: 'start',
                  color: '#aaaaaa',
                  flex: 3
                },
                {
                  type: 'text',
                  text: 'Max: 12',
                  align: 'start',
                  color: '#aaaaaa',
                  flex: 1
                }
              ]
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'button',
              style: 'primary',
              color: '#36435e',
              height: 'sm',
              action: {
                type: 'postback',
                label: 'Bergabung',
                data: generateEvent({
                  type: 'WEREWOLF_JOIN_EVENT'
                })
              },
              flex: 1
            }
          ]
        }
      }
    };
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
            targetId: item.userId,
            timeStamp: Date.now()
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
   * guardianSelection
   */
  public guardianSelection(target: Player[]) {
    const results: Line.TemplateMessage[] = [];
    const chunkFour = _.chunk(target, 4);
    chunkFour.forEach(four => {
      const messageAction: Line.Action[] = [];
      four.forEach(item => {
        const postBackData = generateEvent({
          type: 'GAME_EVENT',
          data: {
            event: 'protect',
            groupId: this.game.groupId,
            targetId: item.userId,
            timeStamp: Date.now()
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
        altText: this.localeService.t('role.guardian.selection'),
        template: {
          type: 'buttons',
          text: this.localeService.t('role.guardian.selection'),
          actions: messageAction as Line.Action[]
        }
      });
    });
    return results;
  }

  /**
   * seerSelection
   */
  public seerSelection(target: Player[]) {
    const results: Line.TemplateMessage[] = [];
    const chunkFour = _.chunk(target, 4);
    chunkFour.forEach(four => {
      const messageAction: Line.Action[] = [];
      four.forEach(item => {
        const postBackData = generateEvent({
          type: 'GAME_EVENT',
          data: {
            event: 'see',
            groupId: this.game.groupId,
            targetId: item.userId,
            timeStamp: Date.now()
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
        altText: this.localeService.t('role.seer.selection'),
        template: {
          type: 'buttons',
          text: this.localeService.t('role.seer.selection'),
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
            targetId: item.userId,
            timeStamp: Date.now()
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

  /**
   * getBasicFlexMessage
   */
  public getBasicFlexMessage(
    header: string,
    message: string
  ): Line.FlexMessage {
    return {
      type: 'flex',
      altText: message,
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: header,
              weight: 'bold',
              size: 'md',
              color: '#aaaaaa'
            },
            {
              type: 'text',
              size: 'xs',
              wrap: true,
              text: message
            }
          ]
        }
      }
    };
  }

  public getPlayerlistMessage(players: Player[]): Line.FlexMessage {
    const playerList: Line.FlexBox[] = players.map(
      (player, index): Line.FlexBox => ({
        type: 'box',
        layout: 'horizontal',
        contents: [
          {
            type: 'text',
            text: `${index + 1}`,
            color: '#aaaaaa',
            flex: 1,
            size: 'sm',
            align: 'start'
          },
          {
            type: 'text',
            text: player.name,
            color: '#aaaaaa',
            flex: 5,
            size: 'sm',
            align: 'start'
          },
          {
            type: 'text',
            text: this.game.localeService.t(
              `common.life.${player.role!.dead ? 'dead' : 'alive'}`
            ),
            color: '#aaaaaa',
            flex: 2,
            size: 'sm',
            align: 'start'
          }
        ]
      })
    );
    return {
      type: 'flex',
      altText: 'Daftar Pemain',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: '📣 Daftar Pemain',
              weight: 'bold',
              color: '#aaaaaa',
              size: 'xl'
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: 'No',
                  color: '#aaaaaa',
                  flex: 1,
                  size: 'sm',
                  weight: 'bold',
                  align: 'start'
                },
                {
                  type: 'text',
                  text: 'Nama',
                  color: '#aaaaaa',
                  flex: 5,
                  size: 'sm',
                  weight: 'bold',
                  align: 'start'
                },
                {
                  type: 'text',
                  text: 'Status',
                  color: '#aaaaaa',
                  flex: 2,
                  size: 'sm',
                  weight: 'bold',
                  align: 'start'
                }
              ]
            },
            {
              type: 'separator',
              color: '#aaaaaa'
            },
            {
              type: 'box',
              layout: 'vertical',
              margin: 'lg',
              contents: [...playerList]
            },
            {
              type: 'separator',
              color: '#aaaaaa',
              margin: 'md'
            },
            {
              type: 'box',
              layout: 'horizontal',
              contents: [
                {
                  type: 'text',
                  text: `Hidup : ${
                    players.filter(player => !player.role!.dead).length
                  } pemain`,
                  color: '#aaaaaa',
                  flex: 1,
                  size: 'sm',
                  weight: 'bold',
                  align: 'start'
                },
                {
                  type: 'text',
                  text: `Mati : ${
                    players.filter(player => player.role!.dead).length
                  } pemain`,
                  color: '#aaaaaa',
                  flex: 1,
                  size: 'sm',
                  weight: 'bold',
                  align: 'end'
                }
              ]
            }
          ]
        }
      }
    };
  }
}
