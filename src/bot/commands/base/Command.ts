import LineMessage from 'src/line/LineMessage';

export default interface Command {
  readonly TYPE: string[];
  readonly TRIGGER: string;

  readonly channel: LineMessage;

  run(message: string, source: any): void;
}
