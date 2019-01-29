import LineMessage from 'src/line/LineMessage';
import GameManager from '../../../manager/GameManager';

export default interface Command {
  readonly TYPE: string[];
  readonly TRIGGER: string;

  readonly channel: LineMessage;
  gameManager?: GameManager;

  prepare(gameManager: GameManager): void;
  run(message: string, source: any): void;
}
