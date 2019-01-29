function timeout(second: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, second * 1000);
  });
}

export default async function GameLoop(): Promise<any> {
  await timeout(10);
  console.log('halooooo');

  // End Game Loop
  Promise.resolve();
}
