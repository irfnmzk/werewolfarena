import { middleware } from '@line/bot-sdk';
import EventEmitter from 'eventemitter3';
import Express from 'express';

import { WebhookEvent } from '@line/bot-sdk';
import Config from '../config/Config';

export default class LineBot extends EventEmitter {
  private config: Config;
  private express: Express.Application;

  constructor() {
    super();

    this.config = new Config();
    this.express = Express();
    this.configureRoute();
  }

  /**
   * Start Express Server
   */
  public listen() {
    this.express.listen(process.env.PORT || 3000, () => {
      console.log('Starting server..');
    });
  }

  private configureRoute() {
    this.express.post('*', middleware(this.config), (req, res) => {
      Promise.all(req.body.event.map(this.handleWebhook));
      res.send({});
    });
  }

  private handleWebhook(event: WebhookEvent) {
    console.log(event);
  }
}
