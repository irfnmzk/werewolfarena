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

  // End Game Loop
  Promise.resolve();
}
