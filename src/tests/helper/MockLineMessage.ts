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

  public getProfileData(userId: string): Promise<Line.Profile> {
    console.log(`Getting Player Data : ${userId}`);
    const data: Line.Profile = {
      displayName: 'test',
      userId: '1111',
      pictureUrl: 'asdas',
      statusMessage: 'asdasd'
    };
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
  // tslint:disable-next-line:no-unused
  public sendMultipleText(id: string, text: string[]): void {
    text.forEach(data =>
      console.log(
        `${chalk.bold.yellow('[Text]')} ${chalk.yellow.bold(
          `[${id}]`
        )} : ${data}`
      )
    );
  }

  public sendMultipleTypeMessage(id: string, message: Line.Message[]) {
    message.forEach(data =>
      console.log(
        `${chalk.bold.yellow('[Text]')} ${chalk.yellow.bold(`[${id}]`)} : ${
          data.type
        }`
      )
    );
  }
}
