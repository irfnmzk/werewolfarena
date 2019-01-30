import Config from '../../../config/Config';
import LineMessage from '../../../line/LineMessage';
import Command from '../base/Command';
import CreateGameCommands from '../group/CreateGameCommands';
import JoinGameCommand from '../group/JoinGameCommand';
import GameEventCommand from '../user/GameEventCommand';
import PlayerListCommand from '../group/PlayerListCommand';

const config = new Config();
const lineMessage = new LineMessage(config);

const commands: Command[] = [
  new CreateGameCommands(lineMessage),
  new JoinGameCommand(lineMessage),
  new GameEventCommand(),
  new PlayerListCommand(lineMessage)
];
export default commands;
