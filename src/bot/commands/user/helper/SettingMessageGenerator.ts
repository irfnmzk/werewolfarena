import { FlexMessage } from '@line/bot-sdk';

export function settingShowRole(groupId: string): FlexMessage {
  return {
    type: 'flex',
    altText: 'Setting',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'Tampilkan Role saat mati?',
            color: '#1DB446',
            size: 'lg',
            weight: 'bold',
            wrap: true
          },
          {
            type: 'box',
            layout: 'horizontal',
            spacing: 'md',
            margin: 'lg',
            contents: [
              {
                type: 'button',
                style: 'primary',
                height: 'sm',
                action: {
                  type: 'postback',
                  label: 'Ya',
                  data: 'hasdas'
                }
              },
              {
                type: 'button',
                style: 'primary',
                height: 'sm',
                color: '#f44242',
                action: {
                  type: 'postback',
                  label: 'Tidak',
                  data: 'hasdas'
                }
              }
            ]
          }
        ]
      }
    }
  };
}

export function settingDuration(groupId: string): FlexMessage {
  return {
    type: 'flex',
    altText: 'Setting',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'Ubah Durasi Permainan',
            color: '#1DB446',
            size: 'lg',
            weight: 'bold',
            wrap: true
          },
          {
            type: 'box',
            layout: 'horizontal',
            spacing: 'md',
            margin: 'lg',
            contents: [
              {
                type: 'button',
                style: 'primary',
                height: 'sm',
                color: '#1DB446',
                action: {
                  type: 'postback',
                  label: '30',
                  data: 'hasdas'
                }
              },
              {
                type: 'button',
                style: 'primary',
                height: 'sm',
                color: '#1DB446',
                action: {
                  type: 'postback',
                  label: '60',
                  data: 'hasdas'
                }
              }
            ]
          },
          {
            type: 'box',
            layout: 'horizontal',
            spacing: 'md',
            margin: 'lg',
            contents: [
              {
                type: 'button',
                style: 'primary',
                height: 'sm',
                color: '#1DB446',
                action: {
                  type: 'postback',
                  label: '90',
                  data: 'hasdas'
                }
              },
              {
                type: 'button',
                style: 'primary',
                height: 'sm',
                color: '#1DB446',
                action: {
                  type: 'postback',
                  label: '120',
                  data: 'hasdas'
                }
              }
            ]
          },
          {
            type: 'box',
            layout: 'horizontal',
            spacing: 'md',
            margin: 'lg',
            contents: [
              {
                type: 'button',
                style: 'primary',
                height: 'sm',
                color: '#1DB446',
                action: {
                  type: 'postback',
                  label: '150',
                  data: 'hasdas'
                }
              },
              {
                type: 'button',
                style: 'primary',
                height: 'sm',
                color: '#1DB446',
                action: {
                  type: 'postback',
                  label: '180',
                  data: 'hasdas'
                }
              }
            ]
          }
        ]
      }
    }
  };
}
