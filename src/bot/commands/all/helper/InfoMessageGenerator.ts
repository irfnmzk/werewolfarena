import { RoleId } from '@game/roles/base/RoleTypes';
import { FlexMessage } from '@line/bot-sdk';
import LocaleService from '../../../../utils/i18n/LocaleService';

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
