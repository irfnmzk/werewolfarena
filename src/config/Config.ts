import path from 'path';

import ConfigInterface from './configInterface';

export default class Config implements ConfigInterface {
  public channelAccessToken!: string;
  public channelSecret!: string;

  private readonly CONFIG_PATH = path.join(
    __dirname,
    '..',
    '..',
    'config',
    'config.json'
  );

  [index: string]: any;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (!require.resolve(this.CONFIG_PATH)) {
      throw new Error('Config Not Found');
      return;
    }

    const savedConfig = require(this.CONFIG_PATH);
    this.initilaizeWith(savedConfig);
  }

  private initilaizeWith(data: any) {
    Object.keys(data).forEach(field => (this[field] = data[field]));
  }
}
