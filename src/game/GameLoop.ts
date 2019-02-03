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
    // Loading role
    await this.timeout(3);
    this.game.assignRole();
    this.game.broadcastRole();
    await this.timeout(5);
    this.game.firstDayScene();
    await this.timeout(60);

    // Loop till the end of game
    while (this.playing) {
      // Night scene
      await this.game.nightScene();

      // Increment number of days
      this.game.addDay();

      // Day Scene
      await this.game.dayScene();

      // Dusk Scene (Voting Time)
      await this.game.duskScene();
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
