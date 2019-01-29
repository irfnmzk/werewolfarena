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

  await timeout(10);

  await game.channel.gameLoopBroadcast(game.groupId, 'Game Started 2');

  // End Game Loop
  Promise.resolve();
}
