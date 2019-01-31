import ILineMessage from 'src/line/base/ILineMessage';
import * as Line from '@line/bot-sdk';
import Player from '@game/base/Player';
import chalk from 'chalk';

// tslint:disable-next-line:no-var-requires
require('console-stamp')(console, { pattern: 'HH:MM:ss.l' });

export default class MockLineMessage implements ILineMessage {
  public replyWithText(replyToken: string = '', text: string) {
    console.log(
      `${chalk.bgCyan.bold('[reply]')} [${chalk.bgBlue(
        replyToken
      )}] : ${chalk.bgGreenBright(text)}`
    );
  }

  public gameLoopBroadcast(groupId: string, message: string): Promise<any> {
    console.log(
      `${chalk.cyan.bold('[broadcast]')} ${chalk.cyan.bold(
        `[${groupId}]`
      )} : ${message}`
    );
    return Promise.resolve();
  }

  public sendWithText(id: string, text: string): Promise<any> {
    console.log(
      `${chalk.bold.yellow('[Text]')} ${chalk.yellow.bold(`[${id}]`)} : ${text}`
    );

    return Promise.resolve();
  }

  public getPlayerData(userId: string): Promise<Player> {
    console.log(`Getting Player Data : ${userId}`);
    const data: Player = { name: 'test', userId: '1111' };
    return Promise.resolve(data);
  }

  public sendTemplateMessage(
    userId: string,
    template: Line.TemplateMessage[]
  ): void {
    console.log(
      `${chalk.bold.yellow('[template]')} ${chalk.yellow.bold(
        `[${userId}]`
      )} : ${template[0].altText}`
    );
  }

  public sendMultiText(player: Player[], text: string): void {
    console.log(
      `${chalk.bold.yellow('[Multi Text]')} ${chalk.yellow.bold(
        `[${player.length}]`
      )} : ${text}`
    );
  }
}
