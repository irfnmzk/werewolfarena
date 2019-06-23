import Game from 'src/game/Game';
import Group from './base/Group';
import DatabaseAdapter from '../utils/db/DatabaseAdapter';
import GroupSetting from 'src/utils/db/models/GroupSetting';
import LineMessage from 'src/line/LineMessage';

export default class GroupManager extends Map<string, Group> {
  private readonly database: DatabaseAdapter;
  private readonly channel: LineMessage;

  constructor(database: DatabaseAdapter, channel: LineMessage) {
    super();

    this.database = database;
    this.channel = channel;

    this.setupLeaveGroupScheduler();
  }

  /**
   * createGroup
   */
  public async createGroup(groupId: string) {
    // Todo check from db
    const groupData = await this.database.group.firstOrCreate(groupId);
    const groupStats = await this.database.group.getStats(groupId);
    const group = new Group(groupData.groupId, groupStats);
    this.set(groupId, group);
  }

  /**
   * createGame
   * Add game to to room
   */
  public async createGame(groupId: string, game: Game) {
    if (!this.has(groupId)) await this.createGroup(groupId);
    this.get(groupId)!.game = game;
    this.get(groupId)!.running = true;
    this.notifyUsers(groupId);
  }

  /**
   * gameExist
   */
  public async gameExist(groupId: string) {
    if (!this.has(groupId)) await this.createGroup(groupId);
    return this.get(groupId)!.running;
  }

  /**
   * deletGame
   */
  public deletGame(groupId: string) {
    if (!this.has(groupId)) return;
    const group = this.get(groupId)!;
    if (!group.game) return;
    delete group.game; // any better solution?
    group.running = false;
    group.lastRun = Date.now();
  }

  /**
   * killGroup
   */
  public killGroup(groupId: string) {
    if (!this.has(groupId)) return;
    if (!this.get(groupId)!.game) return;
    this.get(groupId)!.game!.killGame();
    this.delete(groupId);
  }

  /**
   * notifyUserForGame
   */
  public async notifyUserForGame(groupId: string, userId: string) {
    if (!this.has(groupId)) await this.createGroup(groupId);
    this.get(groupId)!.notifyUserList.push(userId);
  }

  /**
   * getStats
   */
  public async getStats(groupId: string) {
    if (!this.has(groupId)) await this.createGroup(groupId);
    return this.get(groupId)!.groupStats;
  }

  /**
   * updateStatistics
   */
  public updateStats(groupId: string) {
    const oldStats = this.get(groupId)!.groupStats;
    const newStats = {
      ...oldStats,
      gamePlayed: oldStats.gamePlayed + 1
    };
    this.get(groupId)!.groupStats = newStats;
    this.database.group.updateStats(groupId, newStats);
  }

  /**
   * getGroupSetting
   */
  public async getGroupSetting(groupId: string) {
    if (!this.has(groupId)) await this.createGroup(groupId);
    return this.database.group.getGroupSetting(groupId);
  }

  /**
   * setGroupSetting
   */
  public async setGroupSetting(groupId: string, setting: GroupSetting) {
    if (!this.has(groupId)) await this.createGroup(groupId);
    this.database.group.setGroupSetting(groupId, setting);
  }

  public getStatus() {
    let onlineGroup = 0;
    let onlinePlayer = 0;
    this.forEach(group => {
      if (group.running) {
        onlineGroup++;
        onlinePlayer += group.game!.players.length;
      }
    });

    return { onlineGroup, onlinePlayer };
  }

  private notifyUsers(groupId: string) {
    this.get(groupId)!.notifyUserList.forEach(userId => {
      this.get(groupId)!.game!.sendNotifyToWaitingList(userId);
    });
    this.get(groupId)!.notifyUserList = [];
  }

  private setupLeaveGroupScheduler() {
    setInterval(() => {
      this.forEach(group => {
        const diff = Date.now() - group.lastRun;
        const minuteDiff = Math.floor(diff / 1000 / 60);

        if (group.running) return;
        if (minuteDiff <= 4) return;
        this.channel
          .sendWithText(
            group.groupId,
            // tslint:disable-next-line: max-line-length
            'Kami tidak mendeteksi adanya permainan dalam 5 menit terakhir, untuk bermain kembali silahkan undang bot ini ke groupchat kalian'
          )
          .then(() =>
            this.channel
              .leaveGroup(group.groupId)
              .catch(() => this.channel.leaveRoom(group.groupId))
          );
        this.delete(group.groupId);
      });
    }, 5 * 60 * 1000);
  }
}
