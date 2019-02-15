import { FlexMessage } from '@line/bot-sdk';
import generateEvent from '../../../../game/roles/helper/EventGenerator';

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
                  data: generateEvent({
                    type: 'SET_GROUP_SETTING',
                    data: { groupId, setting: 'SHOWROLE', value: true }
                  })
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
                  data: generateEvent({
                    type: 'SET_GROUP_SETTING',
                    data: { groupId, setting: 'SHOWROLE', value: false }
                  })
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
                  data: generateEvent({
                    type: 'SET_GROUP_SETTING',
                    data: { groupId, setting: 'DURATION', value: 30 }
                  })
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
                  data: generateEvent({
                    type: 'SET_GROUP_SETTING',
                    data: { groupId, setting: 'DURATION', value: 60 }
                  })
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
                  data: generateEvent({
                    type: 'SET_GROUP_SETTING',
                    data: { groupId, setting: 'DURATION', value: 90 }
                  })
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
                  data: generateEvent({
                    type: 'SET_GROUP_SETTING',
                    data: { groupId, setting: 'DURATION', value: 120 }
                  })
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
                  data: generateEvent({
                    type: 'SET_GROUP_SETTING',
                    data: { groupId, setting: 'DURATION', value: 150 }
                  })
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
                  data: generateEvent({
                    type: 'SET_GROUP_SETTING',
                    data: { groupId, setting: 'DURATION', value: 180 }
                  })
                }
              }
            ]
          }
        ]
      }
    }
  };
}
