import LineMessage from 'src/line/LineMessage';
import GameManager from '../../../manager/GameManager';
import MessageSource from '../../base/MessageSource';

export default interface Command {
  readonly TYPE: string[];
  readonly TRIGGER: string[];

  readonly channel?: LineMessage;
  gameManager?: GameManager;

  prepare(gameManager: GameManager): void;
  run(data: any, source: MessageSource): void;
}
