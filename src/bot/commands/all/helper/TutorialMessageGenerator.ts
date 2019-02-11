import { FlexMessage } from '@line/bot-sdk';

export function getTutorialMessage(): FlexMessage {
  return {
    type: 'flex',
    altText: 'Tutorial',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: 'Butuh bantuan?',
            size: 'lg',
            color: '#36435e',
            weight: 'bold'
          },
          {
            type: 'button',
            style: 'primary',
            color: '#36435e',
            height: 'sm',
            margin: 'lg',
            action: {
              type: 'message',
              label: 'Cara Main',
              text: '/caramain'
            }
          },
          {
            type: 'button',
            style: 'primary',
            color: '#36435e',
            height: 'sm',
            margin: 'lg',
            action: {
              type: 'message',
              label: 'Daftar Perintah',
              text: '/commands'
            }
          }
        ]
      }
    }
  };
}
