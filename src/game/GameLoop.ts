import Game from './Game';

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

  while (true) {
    day++;
    game.nightScene(day);

    await timeout(10);
    game.sceneWillEnd();

    game.dayScene(day);

    await timeout(10);
    game.sceneWillEnd();

    game.duskScene(day);

    await timeout(10);
    game.sceneWillEnd();
  }

  // End Game Loop
  Promise.resolve();
}
