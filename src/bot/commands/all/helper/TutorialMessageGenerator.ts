import { FlexMessage, FlexBox } from '@line/bot-sdk';
import LocaleService from 'src/utils/i18n/LocaleService';

export function getHelpMessage(): FlexMessage {
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
              text: '/tutorial'
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

export function getCommandListMessage(
  data: { name: string; desc: string }[]
): FlexMessage {
  const datalist = data.map(
    (item): FlexBox => {
      return {
        type: 'box',
        layout: 'horizontal',
        contents: [
          {
            type: 'text',
            text: item.name,
            size: 'xs',
            color: '#36435e',
            weight: 'bold',
            flex: 1
          },
          {
            type: 'text',
            text: item.desc,
            size: 'xs',
            wrap: true,
            flex: 3
          }
        ]
      };
    }
  );
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
            text: 'Daftar Perintah',
            size: 'lg',
            color: '#36435e',
            weight: 'bold'
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            contents: [...datalist]
          }
        ]
      }
    }
  };
}

export function getTutorialMessage(local: LocaleService): FlexMessage {
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
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            contents: [
              {
                type: 'text',
                text: 'Apa Itu Werewolf 🐺',
                size: 'lg',
                color: '#36435e',
                weight: 'bold'
              },
              {
                type: 'text',
                text: local.t('tutorial.opening'),
                size: 'sm',
                wrap: true
              }
            ]
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            contents: [
              {
                type: 'text',
                text: 'Tim dan Peran 👁',
                size: 'lg',
                color: '#36435e',
                weight: 'bold'
              },
              {
                type: 'text',
                text: local.t('tutorial.team'),
                size: 'sm',
                wrap: true
              }
            ]
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            contents: [
              {
                type: 'text',
                text: 'Alur Permainan ⏳',
                size: 'lg',
                color: '#36435e',
                weight: 'bold'
              },
              {
                type: 'text',
                text: local.t('tutorial.flow'),
                size: 'sm',
                wrap: true
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
              type: 'message',
              label: 'Halaman Selanjutnya',
              text: '/tutorial 2'
            }
          }
        ]
      }
    }
  };
}

export function getTutorialMessage_2(local: LocaleService): FlexMessage {
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
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            contents: [
              {
                type: 'text',
                text: 'Cara Main 🕹',
                size: 'lg',
                color: '#36435e',
                weight: 'bold'
              },
              {
                type: 'text',
                text: local.t('tutorial.play'),
                size: 'sm',
                wrap: true
              }
            ]
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            contents: [
              {
                type: 'text',
                text: 'Cara Melakukan Aksi 🗡',
                size: 'lg',
                color: '#36435e',
                weight: 'bold'
              },
              {
                type: 'text',
                text: local.t('tutorial.action'),
                size: 'sm',
                wrap: true
              }
            ]
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'lg',
            contents: [
              {
                type: 'text',
                text: 'Cara Melakukan Vote 📣',
                size: 'lg',
                color: '#36435e',
                weight: 'bold'
              },
              {
                type: 'text',
                text: local.t('tutorial.vote'),
                size: 'sm',
                wrap: true
              }
            ]
          }
        ]
      }
    }
  };
}
