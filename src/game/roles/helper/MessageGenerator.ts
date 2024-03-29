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
                  text: 'Max: 20',
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
    const playerList = this.game.players.map(
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
            flex: 3,
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
                  flex: 3,
                  size: 'sm',
                  weight: 'bold',
                  align: 'start'
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
  public werewolfSelection(target: Player[]): Line.FlexMessage {
    const players = _.chunk(target, 2);
    const playerList = players.map(
      (data): Line.FlexBox => {
        const targetButton = data.map(
          (targetPlayer): Line.FlexButton => ({
            type: 'button',
            style: 'primary',
            height: 'sm',
            color: '#f44242',
            action: {
              type: 'postback',
              label: targetPlayer.name,
              data: generateEvent({
                type: 'GAME_EVENT',
                data: {
                  event: 'bite',
                  groupId: this.game.groupId,
                  targetId: targetPlayer.userId,
                  timeStamp: Date.now()
                }
              })
            }
          })
        );
        return {
          type: 'box',
          layout: 'horizontal',
          spacing: 'sm',
          contents: [...targetButton]
        };
      }
    );
    return {
      type: 'flex',
      altText: 'Pilih pemain untuk di makan malam ini!',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents: [
            {
              type: 'text',
              text: 'Night Time',
              color: '#1DB446',
              size: 'lg',
              weight: 'bold'
            },
            {
              type: 'text',
              text: 'Pilih Pemain untuk di makan malam ini!',
              color: '#aaaaaa',
              size: 'sm'
            },
            {
              type: 'box',
              spacing: 'md',
              layout: 'vertical',
              contents: [...playerList]
            }
          ]
        }
      }
    };
  }

  /**
   * guardianSelection
   */
  public guardianSelection(target: Player[]): Line.FlexMessage {
    const players = _.chunk(target, 2);
    const playerList = players.map(
      (data): Line.FlexBox => {
        const targetButton = data.map(
          (targetPlayer): Line.FlexButton => ({
            type: 'button',
            style: 'primary',
            height: 'sm',
            action: {
              type: 'postback',
              label: targetPlayer.name,
              data: generateEvent({
                type: 'GAME_EVENT',
                data: {
                  event: 'protect',
                  groupId: this.game.groupId,
                  targetId: targetPlayer.userId,
                  timeStamp: Date.now()
                }
              })
            }
          })
        );
        return {
          type: 'box',
          layout: 'horizontal',
          spacing: 'sm',
          contents: [...targetButton]
        };
      }
    );
    return {
      type: 'flex',
      altText: 'Pilih pemain untuk di lindungi malam ini!',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents: [
            {
              type: 'text',
              text: 'Night Time',
              color: '#1DB446',
              size: 'lg',
              weight: 'bold'
            },
            {
              type: 'text',
              text: 'Pilih Pemain untuk di lindungi malam ini!',
              color: '#aaaaaa',
              size: 'sm'
            },
            {
              type: 'box',
              spacing: 'md',
              layout: 'vertical',
              contents: [...playerList]
            }
          ]
        }
      }
    };
  }

  /**
   * seerSelection
   */
  public seerSelection(target: Player[]): Line.FlexMessage {
    const players = _.chunk(target, 2);
    const playerList = players.map(
      (data): Line.FlexBox => {
        const targetButton = data.map(
          (targetPlayer): Line.FlexButton => ({
            type: 'button',
            style: 'primary',
            height: 'sm',
            color: '#36435e',
            action: {
              type: 'postback',
              label: targetPlayer.name,
              data: generateEvent({
                type: 'GAME_EVENT',
                data: {
                  event: 'see',
                  groupId: this.game.groupId,
                  targetId: targetPlayer.userId,
                  timeStamp: Date.now()
                }
              })
            }
          })
        );
        return {
          type: 'box',
          layout: 'horizontal',
          spacing: 'sm',
          contents: [...targetButton]
        };
      }
    );
    return {
      type: 'flex',
      altText: 'Pilih pemain untuk di terawang malam ini!',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents: [
            {
              type: 'text',
              text: 'Night Time',
              color: '#1DB446',
              size: 'lg',
              weight: 'bold'
            },
            {
              type: 'text',
              text: 'Pilih Pemain untuk di terawang malam ini!',
              color: '#aaaaaa',
              size: 'sm'
            },
            {
              type: 'box',
              spacing: 'md',
              layout: 'vertical',
              contents: [...playerList]
            }
          ]
        }
      }
    };
  }

  /**
   * gunnerSelection
   */
  public gunnerSelection(target: Player[]): Line.FlexMessage {
    const players = _.chunk(target, 2);
    const playerList = players.map(
      (data): Line.FlexBox => {
        const targetButton = data.map(
          (targetPlayer): Line.FlexButton => ({
            type: 'button',
            style: 'primary',
            height: 'sm',
            color: '#36435e',
            action: {
              type: 'postback',
              label: targetPlayer.name,
              data: generateEvent({
                type: 'GAME_EVENT',
                data: {
                  event: 'shoot',
                  groupId: this.game.groupId,
                  targetId: targetPlayer.userId,
                  timeStamp: Date.now()
                }
              })
            }
          })
        );
        return {
          type: 'box',
          layout: 'horizontal',
          spacing: 'sm',
          contents: [...targetButton]
        };
      }
    );
    return {
      type: 'flex',
      altText: 'Pilih pemain untuk di Tembak!!',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents: [
            {
              type: 'text',
              text: 'Day Time',
              color: '#1DB446',
              size: 'lg',
              weight: 'bold'
            },
            {
              type: 'text',
              text: 'Pilih pemain untuk di Tembak!!',
              color: '#aaaaaa',
              size: 'sm'
            },
            {
              type: 'box',
              spacing: 'md',
              layout: 'vertical',
              contents: [...playerList]
            }
          ]
        }
      }
    };
  }

  /**
   * harlotSelection
   */
  public harlotSelection(target: Player[]): Line.FlexMessage {
    const players = _.chunk(target, 2);
    const playerList = players.map(
      (data): Line.FlexBox => {
        const targetButton = data.map(
          (targetPlayer): Line.FlexButton => ({
            type: 'button',
            style: 'primary',
            height: 'sm',
            action: {
              type: 'postback',
              label: targetPlayer.name,
              data: generateEvent({
                type: 'GAME_EVENT',
                data: {
                  event: 'visit',
                  groupId: this.game.groupId,
                  targetId: targetPlayer.userId,
                  timeStamp: Date.now()
                }
              })
            }
          })
        );
        return {
          type: 'box',
          layout: 'horizontal',
          spacing: 'sm',
          contents: [...targetButton]
        };
      }
    );
    return {
      type: 'flex',
      altText: 'Pilih pemain untuk di kunjungi malam ini!',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents: [
            {
              type: 'text',
              text: 'Night Time',
              color: '#1DB446',
              size: 'lg',
              weight: 'bold'
            },
            {
              type: 'text',
              text: 'Pilih Pemain untuk di kunjungi malam ini!',
              color: '#aaaaaa',
              size: 'sm'
            },
            {
              type: 'box',
              spacing: 'md',
              layout: 'vertical',
              contents: [...playerList]
            }
          ]
        }
      }
    };
  }

  /**
   * hunterSelection
   */
  public hunterSelection(target: Player[]): Line.FlexMessage {
    const players = _.chunk(target, 2);
    const playerList = players.map(
      (data): Line.FlexBox => {
        const targetButton = data.map(
          (targetPlayer): Line.FlexButton => ({
            type: 'button',
            style: 'primary',
            height: 'sm',
            color: '#f44242',
            action: {
              type: 'postback',
              label: targetPlayer.name,
              data: generateEvent({
                type: 'GAME_EVENT',
                data: {
                  event: 'revenge',
                  groupId: this.game.groupId,
                  targetId: targetPlayer.userId,
                  timeStamp: Date.now()
                }
              })
            }
          })
        );
        return {
          type: 'box',
          layout: 'horizontal',
          spacing: 'sm',
          contents: [...targetButton]
        };
      }
    );
    return {
      type: 'flex',
      altText: 'Pilih pemain untuk di Bunuh!',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents: [
            {
              type: 'text',
              text: 'Revenge Time',
              color: '#1DB446',
              size: 'lg',
              weight: 'bold'
            },
            {
              type: 'text',
              text: 'Pilih Pemain untuk di Bunuh!',
              color: '#aaaaaa',
              size: 'sm'
            },
            {
              type: 'box',
              spacing: 'md',
              layout: 'vertical',
              contents: [...playerList]
            }
          ]
        }
      }
    };
  }

  /**
   * doctorSelection
   */
  public doctorSelection(target: Player[]): Line.FlexMessage {
    const players = _.chunk(target, 2);
    const playerList = players.map(
      (data): Line.FlexBox => {
        const targetButton = data.map(
          (targetPlayer): Line.FlexButton => ({
            type: 'button',
            style: 'primary',
            height: 'sm',
            color: '#f44242',
            action: {
              type: 'postback',
              label: targetPlayer.name,
              data: generateEvent({
                type: 'GAME_EVENT',
                data: {
                  event: 'revive',
                  groupId: this.game.groupId,
                  targetId: targetPlayer.userId,
                  timeStamp: Date.now()
                }
              })
            }
          })
        );
        return {
          type: 'box',
          layout: 'horizontal',
          spacing: 'sm',
          contents: [...targetButton]
        };
      }
    );
    return {
      type: 'flex',
      altText: 'Pilih pemain untuk di hidupkan kemabali!',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents: [
            {
              type: 'text',
              text: 'Revive Time',
              color: '#1DB446',
              size: 'lg',
              weight: 'bold'
            },
            {
              type: 'text',
              text: 'Pilih Pemain untuk di hidupkan kembali!',
              color: '#aaaaaa',
              size: 'sm'
            },
            {
              type: 'box',
              spacing: 'md',
              layout: 'vertical',
              contents: [...playerList]
            }
          ]
        }
      }
    };
  }

  /**
   * cupidSelectionOne
   */
  public cupidSelectionOne(target: Player[]): Line.FlexMessage {
    const players = _.chunk(target, 2);
    const playerList = players.map(
      (data): Line.FlexBox => {
        const targetButton = data.map(
          (targetPlayer): Line.FlexButton => ({
            type: 'button',
            style: 'primary',
            height: 'sm',
            color: '#f44242',
            action: {
              type: 'postback',
              label: targetPlayer.name,
              data: generateEvent({
                type: 'GAME_EVENT',
                data: {
                  event: 'cupid',
                  groupId: this.game.groupId,
                  targetId: targetPlayer.userId,
                  timeStamp: Date.now()
                }
              })
            }
          })
        );
        return {
          type: 'box',
          layout: 'horizontal',
          spacing: 'sm',
          contents: [...targetButton]
        };
      }
    );
    return {
      type: 'flex',
      altText: 'Pilih pemain pertama untuk di jodohkan!',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents: [
            {
              type: 'text',
              text: 'Cupid Time',
              color: '#1DB446',
              size: 'lg',
              weight: 'bold'
            },
            {
              type: 'text',
              text: 'Pilih pemain pertama untuk di jodohkan!',
              color: '#aaaaaa',
              size: 'sm'
            },
            {
              type: 'box',
              spacing: 'md',
              layout: 'vertical',
              contents: [...playerList]
            }
          ]
        }
      }
    };
  }

  /**
   * cupidSelectionTwo
   */
  public cupidSelectionTwo(target: Player[]): Line.FlexMessage {
    const players = _.chunk(target, 2);
    const playerList = players.map(
      (data): Line.FlexBox => {
        const targetButton = data.map(
          (targetPlayer): Line.FlexButton => ({
            type: 'button',
            style: 'primary',
            height: 'sm',
            color: '#f44242',
            action: {
              type: 'postback',
              label: targetPlayer.name,
              data: generateEvent({
                type: 'GAME_EVENT',
                data: {
                  event: 'cupid',
                  groupId: this.game.groupId,
                  targetId: targetPlayer.userId,
                  timeStamp: Date.now()
                }
              })
            }
          })
        );
        return {
          type: 'box',
          layout: 'horizontal',
          spacing: 'sm',
          contents: [...targetButton]
        };
      }
    );
    return {
      type: 'flex',
      altText: 'Pilih pemain kedua untuk di jodohkan!',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents: [
            {
              type: 'text',
              text: 'Cupid Time',
              color: '#1DB446',
              size: 'lg',
              weight: 'bold'
            },
            {
              type: 'text',
              text: 'Pilih pemain kedua untuk di jodohkan!',
              color: '#aaaaaa',
              size: 'sm'
            },
            {
              type: 'box',
              spacing: 'md',
              layout: 'vertical',
              contents: [...playerList]
            }
          ]
        }
      }
    };
  }

  /**
   * cultistSelection
   */
  public cultistSelection(target: Player[]): Line.FlexMessage {
    const players = _.chunk(target, 2);
    const playerList = players.map(
      (data): Line.FlexBox => {
        const targetButton = data.map(
          (targetPlayer): Line.FlexButton => ({
            type: 'button',
            style: 'primary',
            height: 'sm',
            color: '#f44242',
            action: {
              type: 'postback',
              label: targetPlayer.name,
              data: generateEvent({
                type: 'GAME_EVENT',
                data: {
                  event: 'culting',
                  groupId: this.game.groupId,
                  targetId: targetPlayer.userId,
                  timeStamp: Date.now()
                }
              })
            }
          })
        );
        return {
          type: 'box',
          layout: 'horizontal',
          spacing: 'sm',
          contents: [...targetButton]
        };
      }
    );
    return {
      type: 'flex',
      altText: 'Pilih pemain untuk di hasut menjadi cult!',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents: [
            {
              type: 'text',
              text: 'Cult Time',
              color: '#1DB446',
              size: 'lg',
              weight: 'bold'
            },
            {
              type: 'text',
              text: 'Pilih pemain untuk di hasut menjadi cult!',
              color: '#aaaaaa',
              size: 'sm'
            },
            {
              type: 'box',
              spacing: 'md',
              layout: 'vertical',
              contents: [...playerList]
            }
          ]
        }
      }
    };
  }

  /**
   * voteSelection
   */
  public voteSelection(target: Player[]): Line.FlexMessage {
    const players = _.chunk(target, 2);
    const playerList = players.map(
      (data): Line.FlexBox => {
        const targetButton = data.map(
          (targetPlayer): Line.FlexButton => ({
            type: 'button',
            style: 'primary',
            height: 'sm',
            color: '#f44242',
            action: {
              type: 'postback',
              label: targetPlayer.name,
              data: generateEvent({
                type: 'GAME_EVENT',
                data: {
                  event: 'vote',
                  groupId: this.game.groupId,
                  targetId: targetPlayer.userId,
                  timeStamp: Date.now()
                }
              })
            }
          })
        );
        return {
          type: 'box',
          layout: 'horizontal',
          spacing: 'sm',
          contents: [...targetButton]
        };
      }
    );
    return {
      type: 'flex',
      altText: 'Pilih pemain untuk di eksekusi',
      contents: {
        type: 'bubble',
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          contents: [
            {
              type: 'text',
              text: 'Voting Time',
              color: '#1DB446',
              size: 'lg',
              weight: 'bold'
            },
            {
              type: 'text',
              text: 'Pilih Pemain untuk di eksekusi!',
              color: '#aaaaaa',
              size: 'sm'
            },
            {
              type: 'box',
              spacing: 'md',
              layout: 'vertical',
              contents: [...playerList]
            }
          ]
        }
      }
    };
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
      altText: `Kamu punya pesan!`,
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
    const playerList = players.map(
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

  /**
   * getEndGameMessage
   */
  public getEndGameMessage(players: Player[]): Line.FlexMessage {
    const playerList = players.map(
      (player, index): Line.FlexBox => ({
        type: 'box',
        layout: 'horizontal',
        contents: [
          {
            type: 'text',
            text: `${index + 1}`,
            color: '#aaaaaa',
            flex: 1,
            size: 'xxs',
            align: 'start'
          },
          {
            type: 'text',
            text: player.name,
            color: '#aaaaaa',
            flex: 4,
            size: 'xxs',
            align: 'start'
          },
          {
            type: 'text',
            text: player.role!.roleHistory.map(data => data).join('>'),
            color: '#aaaaaa',
            flex: 3,
            size: 'xxs',
            align: 'start',
            wrap: true
          },
          {
            type: 'text',
            text: this.game.getWinningMessage(player),
            color: '#aaaaaa',
            flex: 2,
            size: 'xxs',
            align: 'start',
            weight: 'bold'
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
              text: `🎉 ${this.game.winner} Menang! 🎉`,
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
                  align: 'start'
                },
                {
                  type: 'text',
                  text: 'Peran',
                  color: '#aaaaaa',
                  flex: 3,
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
            }
          ]
        }
      }
    };
  }
}
