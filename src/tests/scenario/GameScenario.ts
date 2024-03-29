// tslint:disable-next-line:no-var-requires
require('dotenv');
// tslint:disable:no-unused
import MockLineMessage from '../helper/MockLineMessage';
import Game from '../../game/Game';
import generateFakePlayers from '../../bot/commands/helper/GenerateFakePlayer';
import { time } from '../../game/roles/base/RoleTypes';
import chalk from 'chalk';
import ge from '../helper/GenerateEvent';
import Player from '../../game/base/Player';
import DefaultGameMode from '../../game/gamemode/DefaultGameMode';

export const groupId = 'group_1';
const mockLineMessage = new MockLineMessage();
const game = new Game(
  groupId,
  mockLineMessage,
  { showRole: 'YA', duration: 30 },
  undefined,
  undefined,
  true
);
game.gameDuration = 5;
const palyers = generateFakePlayers(12);

const gamemode = new DefaultGameMode(game);

for (let index = 0; index < 20; index++) {
  gamemode.assignRoles(palyers);
}

// // Game Flow
// palyers.forEach(player => game.addPlayer(player));

// game.emitter.on('scene', handleScene);
// // game.emitter.on('extend_time', handleExtend);

// // function handleExtend(scene: time, day: any, player: Player[]) {
// //   const user = player.map(item => item.role!);
// //   user[4].eventCallback(scene, ge('revenge', player[3].userId));
// // }

// function handleScene(scene: time, day: any, player: Player[]) {
//   const user = player.map(item => item.role!);

//   showSceneInfo(scene, day);

//   switch (day) {
//     case 0:
//       switch (scene) {
//         case 'NIGHT':
//           user[4].eventCallback(scene, ge('see', player[0].userId));
//           // user[3].eventCallback(scene, ge('bite', player[0].userId));
//           break;
//         case 'DUSK':
//           // user[0].eventCallback(scene, ge('vote', player[4].userId));
//           break;
//       }
//       break;
//     case 1:
//       switch (scene) {
//         case 'DAY':
//           // user[4].eventCallback(scene, ge('shoot', player[2].userId));
//           break;
//         case 'DUSK':
//           // user[3].eventCallback(scene, ge('vote', player[1].userId));
//           break;
//       }
//       break;
//     case 2:
//       switch (scene) {
//         case 'NIGHT':
//           // user[4].eventCallback(scene, ge('bite', player[2].userId));
//           break;
//         case 'DUSK':
//           // user[0].eventCallback(scene, ge('vote', player[2].userId));
//           break;
//       }
//       break;
//   }
// }

// function showSceneInfo(scene: any, day: any) {
//   console.log(
//     `${chalk.bold.green('==========')} ${chalk.bold(scene)} ${chalk.bold(
//       day
//     )} ${chalk.bold.green('==========')}`
//   );
// }
