import Config from '../../../config/Config';
import LineMessage from '../../../line/LineMessage';
import Command from '../base/Command';
import CreateGameCommands from '../group/CreateGameCommands';
import JoinGameCommand from '../group/JoinGameCommand';
import GameEventCommand from '../user/GameEventCommand';
import PlayerListCommand from '../group/PlayerListCommand';
import ForceStartCommand from '../group/ForceStartCommand';
import ExtendCommand from '../group/ExtendCommand';
import NextGameCommand from '../group/NextGameCommand';
import CancelCommnand from '../group/CancelCommand';

// DEV
import AddBotCommand from '../dev/AddBotCommand';
import CreateTestGameCommand from '../dev/CreateTestGameCommand';
import KillGameCommand from '../dev/KillGameCommand';

const config = new Config();
const lineMessage = new LineMessage(config);

const commands: Command[] = [
  // Group
  new CreateGameCommands(lineMessage),
  new JoinGameCommand(lineMessage),
  new PlayerListCommand(lineMessage),
  new ForceStartCommand(lineMessage),
  new ExtendCommand(lineMessage),
  new NextGameCommand(lineMessage),
  new CancelCommnand(lineMessage),

  // User
  new GameEventCommand(lineMessage),

  // Dev
  new AddBotCommand(lineMessage),
  new CreateTestGameCommand(lineMessage),
  new KillGameCommand(lineMessage)
];
export default commands;
