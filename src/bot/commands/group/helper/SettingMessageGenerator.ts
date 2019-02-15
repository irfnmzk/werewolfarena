import { FlexMessage } from '@line/bot-sdk';
import GameOptions from '@game/base/GameOptions';
import generateEvent from '../../../../game/roles/helper/EventGenerator';

export function getSettingMessage(
  option: GameOptions,
  groupId: string
): FlexMessage {
  return {
    type: 'flex',
    altText: 'Pengaturan',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'Pengaturan saat ini',
            color: '#1DB446',
            size: 'lg',
            weight: 'bold'
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            contents: [
              {
                type: 'box',
                layout: 'horizontal',
                contents: [
                  {
                    type: 'text',
                    text: 'Tampilkan role saat mati',
                    align: 'start',
                    color: '#aaaaaa',
                    flex: 3
                  },
                  {
                    type: 'text',
                    text: option.showRole ? 'Ya' : 'Tidak',
                    align: 'end',
                    color: '#000000',
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
                    text: 'Durasi Waktu',
                    align: 'start',
                    color: '#aaaaaa',
                    flex: 3
                  },
                  {
                    type: 'text',
                    text: `${option.duration} Detik`,
                    align: 'end',
                    color: '#000000',
                    weight: 'bold',
                    flex: 1
                  }
                ]
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
              label: 'Ubah',
              data: generateEvent({ type: 'GET_GROUP_SETTING', data: groupId })
            },
            flex: 1
          }
        ]
      }
    }
  };
}
