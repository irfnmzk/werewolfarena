import Player from './Player';

export default interface EventQueue {
  user: Player;
  event: string;
  userId: string;
  priority: number;
}
