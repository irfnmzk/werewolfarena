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
  game.broadcastRole();
  game.firstDayScene();

  await timeout(5);

  while (true) {
    // Night scene
    game.nightScene();
    await timeout(10);
    game.sceneWillEnd();

    // Increment number of days
    game.addDay();

    // Day Scene
    game.dayScene();
    await timeout(10);
    game.sceneWillEnd();

    // Dusk Scene (Voting Time)
    game.duskScene();
    await timeout(10);
    game.sceneWillEnd();
  }

  // End Game Loop
  Promise.resolve();
}
