import ConfigInterface from './ConfigInterface';

export default class Config implements ConfigInterface {
  public channelAccessToken: string;
  public channelSecret: string;
  public envType: string;

  constructor() {
    this.envType = process.env.ENV_TYPE!;
    this.channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN!;
    this.channelSecret = process.env.CHANNEL_SECRET!;
  }
}
