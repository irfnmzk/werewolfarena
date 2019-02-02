import UserModel from '../../utils/db/models/User';

export default class User {
  public readonly userId: string;
  public name: string;

  constructor(user: UserModel) {
    this.userId = user.userId;
    this.name = user.name;
  }
}
