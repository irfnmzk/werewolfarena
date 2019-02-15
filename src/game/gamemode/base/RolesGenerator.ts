interface Game {
  deck: any;
  weight: number;
  players: number;
}

const mode = {
  CHAOS: 'CHAOS',
  NORMAL: 'NORMAL'
};

const BALANCEDFLEX = 1;
const CHAOSFLEX = 2;
const SUCCESS = 1;
const FAIL = 0;

export default class RolesGenerator {
  private game: Game;
  private allPlayers: boolean;
  private cards: any;
  private negatives: number;
  private nonnegatives: number;
  private gameCandidate: Game;

  constructor() {
    this.game = { deck: {}, weight: 100, players: 0 };
    this.allPlayers = true;
    this.cards = {};
    this.negatives = -1;
    this.nonnegatives = -1;
    this.gameCandidate = { deck: {}, weight: 100, players: 0 };
  }
}
