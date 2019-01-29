import Player from './Player';

export default interface EventQueue {
  user: Player;
  event: string;
  target: Player;
  priority: number;
}
