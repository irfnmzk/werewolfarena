import firebase from 'firebase-admin';
import GroupAdapter from './adapters/GroupAdapter';
import UsersAdapter from './adapters/UsersAdapter';
import Config from '../../config/Config';

export default class DatabaseAdapter {
  public readonly group: GroupAdapter;
  public readonly user: UsersAdapter;

  protected readonly adapter: firebase.database.Database;
  private config: Config;

  constructor() {
    this.config = new Config();
    this.adapter = firebase
      .initializeApp({
        credential: firebase.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      })
      .database();

    this.group = new GroupAdapter(this.adapter);
    this.user = new UsersAdapter(this.adapter);
  }
}
