import _ from 'lodash';
import * as Line from '@line/bot-sdk';
import Player from '@game/base/Player';

export function werewolfSelection(target: Player[]) {
  const results: Line.TemplateMessage[] = [];
  const chunkFour = _.chunk(target, 4);
  chunkFour.forEach(four => {
    const messageAction: Line.PostbackAction[] = [];
    four.forEach(item => {
      messageAction.push({
        type: 'postback',
        displayText: item.name,
        data: `event=bite`
      });
    });
    results.push({
      type: 'template',
      altText: 'Pilih Pemain untuk di makan malam ini',
      template: {
        type: 'buttons',
        text: 'Pilih Pemain untuk di makan malam ini',
        actions: messageAction as Line.Action[]
      }
    });
  });
  return results;
}
