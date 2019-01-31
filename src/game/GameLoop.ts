import Game from './Game';

export default class GameLoop {
  private playing: boolean;
  private game: Game;

  constructor(game: Game) {
    this.game = game;
    this.playing = true;

    this.addEventListener();
  }

  /**
   * execute
   * Run the game loop
   */
  public async execute(): Promise<any> {
    await this.game.channel.gameLoopBroadcast(
      this.game.groupId,
      'Game Started'
    );

    await this.timeout(3);

    this.game.assignRole();
    this.game.broadcastRole();
    this.game.firstDayScene();

    await this.timeout(5);

    while (this.playing) {
      // Night scene
      this.game.nightScene();
      await this.timeout(30);
      this.game.sceneWillEnd();

      // Increment number of days
      this.game.addDay();

      // Day Scene
      this.game.dayScene();
      await this.timeout(5);
      this.game.sceneWillEnd();

      // Dusk Scene (Voting Time)
      this.game.duskScene();
      await this.timeout(5);
      this.game.sceneWillEnd();
    }

    // End Game Loop
    Promise.resolve();
  }

  private addEventListener() {
    this.game.emitter.on('stop', () => {
      this.playing = false;
    });
  }

  private timeout(second: number) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, second * 1000);
    });
  }
}
