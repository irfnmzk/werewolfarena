import { middleware } from '@line/bot-sdk';
import EventEmitter from 'eventemitter3';
import Express from 'express';

import { WebhookEvent, WebhookRequestBody } from '@line/bot-sdk';
import Config from '../config/Config';
import chalk from 'chalk';

// import LineMessage from './LineMessage';

export default class LineBot extends EventEmitter {
  private config: Config;
  private express: Express.Application;
  // private channel: LineMessage;

  constructor(config: Config) {
    super();

    this.config = config;
    this.express = Express();
    this.configureRoute();
  }

  /**
   * Start Express Server
   */
  public listen() {
    this.express.listen(process.env.PORT || 3000, () => {
      console.info(
        `📣 ${chalk.magenta(
          'Line Webhook now active! on port ' + process.env.PORT
        )}`
      );
    });
  }

  private configureRoute() {
    this.express.post('*', middleware(this.config), ({ body }, res) => {
      const data = body as WebhookRequestBody;
      this.handleWebhook(data);
      res.sendStatus(200);
    });
  }

  private handleWebhook(data: WebhookRequestBody) {
    this.emit('event', data);
    data.events.forEach(event => this.handleSingleEvent(event));
  }

  private handleSingleEvent(event: WebhookEvent) {
    this.emit('events', event);
    const { source } = event;
    event.type = event.type || '';
    switch (event.type) {
      case 'message':
        this.emit('message', event);
        if (source.type === 'room' || source.type === 'group') {
          this.emit('groupMessage', source, event);
        } else {
          this.emit('userMessage', source, event);
        }
        break;
      case 'postback':
        this.emit('postback', source, event);
        break;
      case 'leave':
        this.emit('leave', source, event);
        break;
      case 'join':
        this.emit('join', source, event);
      default:
        break;
    }
  }
}
