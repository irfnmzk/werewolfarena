import Game from './Game';
import * as Types from './roles/base/RoleTypes';

function timeout(second: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, second * 1000);
  });
}

export default async function GameLoop(game: Game): Promise<any> {
  await game.channel.gameLoopBroadcast(game.groupId, 'Game Started');

  await timeout(3);

  game.assignRole();
  game.roleBroadcast();
  game.firstDayScene();

  await timeout(5);

  let day = 0;
  let time: Types.time = 'DAY';

  while (true) {
    day++;
    game.nightScene(day);

    await timeout(5);

    time = 'DAY';
    game.dayScene(day);

    await timeout(5);

    time = 'DUSK';
    game.duskScene(day);

    console.log(time);
  }

  // End Game Loop
  Promise.resolve();
}
