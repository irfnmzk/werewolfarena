import Config from '../../../config/Config';
import LineMessage from '../../../line/LineMessage';
import Command from '../base/Command';
import CreateGameCommands from '../group/CreateGameCommands';
import JoinGameCommand from '../group/JoinGameCommand';

const config = new Config();
const lineMessage = new LineMessage(config);

const commands: Command[] = [
  new CreateGameCommands(lineMessage),
  new JoinGameCommand(lineMessage)
];
export default commands;
