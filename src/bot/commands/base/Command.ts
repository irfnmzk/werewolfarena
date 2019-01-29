export default interface Command {
  readonly TYPE: string[];
  readonly TRIGGER: string;

  run(message: string, source: any): void;
}
