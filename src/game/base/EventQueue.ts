import Player from './Player';
import * as Types from '../roles/base/RoleTypes';

export default interface EventQueue {
  user: Player;
  event: Types.EventType;
  target: Player;
  priority: number;
}
