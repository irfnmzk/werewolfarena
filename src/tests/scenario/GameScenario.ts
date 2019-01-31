import MockLineMessage from '../helper/MockLineMessage';
import Game from '../../game/Game';
import generateFakePlayers from '../../bot/commands/helper/GenerateFakePlayer';

const mockLineMessage = new MockLineMessage();
const game = new Game('group_1', mockLineMessage);
const palyers = generateFakePlayers(5);

// Game Flow
palyers.forEach(player => game.addPlayer(player));
