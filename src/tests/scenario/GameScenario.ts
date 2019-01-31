import MockLineMessage from '../helper/MockLineMessage';
import Game from '../../game/Game';
import generateFakePlayers from '../../bot/commands/helper/GenerateFakePlayer';
import { time } from '../../game/roles/base/RoleTypes';
import chalk from 'chalk';
import ge from '../helper/GenerateEvent';
import Player from '../../game/base/Player';

export const groupId = 'group_1';
const mockLineMessage = new MockLineMessage();
const game = new Game(groupId, mockLineMessage, true);
const palyers = generateFakePlayers(5);

// Game Flow
palyers.forEach(player => game.addPlayer(player));

game.emitter.on('scene', handleScene);

function handleScene(scene: time, day: any, player: Player[]) {
  const user = player.map(item => item.role!);

  showSceneInfo(scene, day);

  switch (day) {
    case 0:
      switch (scene) {
        case 'NIGHT':
          user[4].eventCallback(scene, ge('bite', player[1].userId));
          break;
      }
      break;
  }
}

function showSceneInfo(scene: any, day: any) {
  console.log(
    `${chalk.bold.green('==========')} ${chalk.bold(scene)} ${chalk.bold(
      day
    )} ${chalk.bold.green('==========')}`
  );
}
