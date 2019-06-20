import Config from '../../../config/Config';
import LineMessage from '../../../line/LineMessage';
import Command from '../base/Command';

// ALL
import VersionCommand from '../all/VersionCommand';
import RolesCommand from '../all/RolesCommand';
import InfoCommand from '../all/InfoCommand';
import HelpCommand from '../all/HelpCommand';
import ListCommand from '../all/ListCommand';
import TutorialCommand from '../all/TutorialCommand';
import StatusCommand from '../all/StatusCommand';
import PlayerStatsCommand from '../all/PlayerStatsCommand';

// Group
import CreateGameCommands from '../group/CreateGameCommands';
import JoinGameCommand from '../group/JoinGameCommand';
import GameEventCommand from '../user/GameEventCommand';
import PlayerListCommand from '../group/PlayerListCommand';
import ForceStartCommand from '../group/ForceStartCommand';
import ExtendCommand from '../group/ExtendCommand';
import NextGameCommand from '../group/NextGameCommand';
import CancelCommnand from '../group/CancelCommand';
import GroupStatsCommand from '../group/GroupStatsCommand';
import SettingCommand from '../group/SettingCommand';
import SendSettingCommand from '../group/SendSettingCommand';

// USER
import GetGroupSettingCommand from '../user/GetGroupSettingCommand';
import SetGroupSettingCommand from '../user/SetGroupSettingCommand';

// DEV
import AddBotCommand from '../dev/AddBotCommand';
import CreateTestGameCommand from '../dev/CreateTestGameCommand';
import KillGameCommand from '../dev/KillGameCommand';

const config = new Config();
const lineMessage = new LineMessage(config);

const commands: Command[] = [
  // All
  new VersionCommand(lineMessage),
  new RolesCommand(lineMessage),
  new InfoCommand(lineMessage),
  new HelpCommand(lineMessage),
  new ListCommand(lineMessage),
  new TutorialCommand(lineMessage),
  new StatusCommand(lineMessage),
  new PlayerStatsCommand(lineMessage),

  // Group
  new CreateGameCommands(lineMessage),
  new JoinGameCommand(lineMessage),
  new PlayerListCommand(lineMessage),
  new ForceStartCommand(lineMessage),
  new ExtendCommand(lineMessage),
  new NextGameCommand(lineMessage),
  new CancelCommnand(lineMessage),
  new GroupStatsCommand(lineMessage),
  new SettingCommand(lineMessage),
  new SendSettingCommand(lineMessage),

  // User
  new GameEventCommand(lineMessage),
  new GetGroupSettingCommand(lineMessage),
  new SetGroupSettingCommand(lineMessage),

  // Dev
  new AddBotCommand(lineMessage),
  new CreateTestGameCommand(lineMessage),
  new KillGameCommand(lineMessage)
];
export default commands;
