import { middleware } from '@line/bot-sdk';
import EventEmitter from 'eventemitter3';
import Express from 'express';

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
   * listen
   */
  public listen() {
    this.express.listen(process.env.PORT || 3000, () => {
      console.log('Starting server..');
    });
  }

  private configureRoute() {
    this.express.post('*', middleware(this.config), (req, res) => {
      console.log(req.body);
      res.send({});
    });
  }
}
