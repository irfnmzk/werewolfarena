import cards from '../data/cards.json';

interface Game {
  deck: any;
  weight: number;
  players: number;
}

interface Deck {
  key: string;
  value: number;
  amount: number;
}

interface ClassifedCards {
  negatives: Deck[];
  positive: Deck[];
}

export default class RolesGenerator {
  private game: Game;
  private allPlayers: boolean;
  private cards: any;
  private negatives: number;
  private positive: number;
  private gameCandidate: Game;
  private pivot = 0;

  constructor() {
    this.game = { deck: {}, weight: 100, players: 0 };
    this.allPlayers = true;
    this.cards = {};
    this.negatives = -1;
    this.positive = -1;
    this.gameCandidate = { deck: {}, weight: 100, players: 0 };
  }

  /**
   * create
   */
  public create(
    playerCount: number,
    deck: Deck[],
    gameMode: 'NORMAL' | 'CHAOS'
  ): { deck: any; weight: number; players: number } {
    const classifedCards = this.clasifyCard(deck);
    let flex = gameMode === 'NORMAL' ? 1 : 2;
    this.pivot = gameMode === 'NORMAL' ? 0 : -4;
    let tries = 0;
    while (
      !this.allPlayers ||
      this.game.weight < -1 * flex ||
      this.game.weight > flex
    ) {
      tries++;
      this.setGame(playerCount, classifedCards);
      if (this.gameCandidate.players <= this.game.players) {
        this.gameCandidate = this.game;
      }
      const totalCards = this.negatives + this.positive;
      if (tries % (totalCards * 10) === 0) flex++;
      if (tries > totalCards * 100) break;
    }
    return this.gameCandidate;
  }

  /**
   * createDeck
   */
  public createDeck(deck: { [key: string]: number } = {}) {
    return Object.keys(cards)
      .filter(key => deck[key])
      .map(key => ({
        key,
        value: (cards as any)[key],
        amount: (deck as any)[key]
      }));
  }

  private clasifyCard(card: Deck[]) {
    const classifedCards: ClassifedCards = {
      negatives: [],
      positive: []
    };
    classifedCards.negatives = card.filter(item => item.value < 0);
    classifedCards.positive = card.filter(item => item.value >= 0);
    return classifedCards;
  }

  private setGame(playerCount: number, classifedCards: ClassifedCards) {
    this.resetValues(classifedCards);

    let playersAdded = this.addCardToDeck(Math.random() >= 0.5);

    while (playersAdded < playerCount) {
      const added = this.addCardToDeck(this.game.weight >= this.pivot);
      if (added === 0) break;
      playersAdded += added;
    }
  }

  private resetValues(classifiedCards: ClassifedCards) {
    this.game = {
      deck: {},
      weight: 0,
      players: 0
    };

    this.allPlayers = true;
    this.negatives = classifiedCards.negatives.reduce(
      (a, c) => a + c.amount,
      0
    );
    this.positive = classifiedCards.positive.reduce((a, c) => a + c.amount, 0);
    this.cards = JSON.parse(JSON.stringify(classifiedCards));
  }

  private addCardToDeck(isNegative: boolean) {
    if (isNegative) {
      if (this.negatives < 1) {
        this.allPlayers = false;
        return 0;
      }
      let rand = this.getRandom(this.negatives);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.cards.negatives.length; i++) {
        rand -= this.cards.negatives[i].amount;
        // tslint:disable-next-line:early-exit
        if (rand < 1) {
          this.cards.negatives[i].amount--;
          this.negatives--;
          this.addRandomCard(this.cards.negatives[i]);
          return 1;
        }
      }
      // tslint:disable-next-line:no-collapsible-if
    } else {
      if (this.positive < 1) {
        this.allPlayers = false;
        return 0;
      }

      let rand = this.getRandom(this.positive);
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.cards.positive.length; i++) {
        rand -= this.cards.positive[i].amount;
        // tslint:disable-next-line:early-exit
        if (rand < 1) {
          this.cards.positive[i].amount--;
          this.positive--;
          this.addRandomCard(this.cards.positive[i]);
          return 1;
        }
      }
    }
    return 0;
  }

  private addRandomCard(selectedCard: Deck) {
    this.game.weight += selectedCard.value;
    this.game.players++;
    if (this.game.deck[selectedCard.key]) this.game.deck[selectedCard.key]++;
    else this.game.deck[selectedCard.key] = 1;
  }

  private getRandom(max: number) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
  }
}
