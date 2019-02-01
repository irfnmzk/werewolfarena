import Game from '@game/Game';

export default class Group {
  public readonly groupId: string;
  public running: boolean = false;
  public game?: Game;

  constructor(groupId: string) {
    this.groupId = groupId;
  }
}
