import { RoleId } from '@game/roles/base/RoleTypes';
import { FlexMessage } from '@line/bot-sdk';
import LocaleService from '../../../../utils/i18n/LocaleService';
import PlayerStats from 'src/utils/db/models/PlayerStats';

export function getInfoMessageByRole(
  role: RoleId,
  local: LocaleService
): FlexMessage {
  return {
    type: 'flex',
    altText: 'Daftar Peran',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: local.t(`role.${role}.name`),
            color: '#36435e',
            size: 'lg',
            weight: 'bold'
          },
          {
            type: 'text',
            text: local.t(`role.${role}.description`),
            wrap: true,
            margin: 'lg'
          }
        ]
      }
    }
  };
}

export function getPlayerStatsMessage(_: PlayerStats): FlexMessage {
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
            size: 'xs',
            color: '#36435e',
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
                    text: 'hallo',
                    size: 'xs',
                    color: '#36435e',
                    weight: 'bold',
                    flex: 1
                  },
                  {
                    type: 'text',
                    text: 'tes',
                    size: 'xs',
                    wrap: true,
                    flex: 3
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  };
}
