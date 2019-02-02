import Game from '@game/Game';

export default class Group {
  public readonly groupId: string;
  public running: boolean = false;
  public game?: Game;

  public notifyUserList: string[];

  constructor(groupId: string) {
    this.groupId = groupId;
    this.notifyUserList = [];
  }
}
