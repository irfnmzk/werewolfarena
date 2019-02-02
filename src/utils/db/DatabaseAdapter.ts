import firebase from 'firebase-admin';
import GroupAdapter from './adapters/GroupAdapter';
import UsersAdapter from './adapters/UsersAdapter';

export default class DatabaseAdapter {
  public readonly group: GroupAdapter;
  public readonly user: UsersAdapter;

  protected readonly adapter: firebase.database.Database;

  constructor() {
    const serviceAccount = require('../../../config/firebase/services.json');
    this.adapter = firebase
      .initializeApp({
        credential: firebase.credential.cert(serviceAccount),
        databaseURL: 'https://line-wolf-id.firebaseio.com'
      })
      .database();

    this.group = new GroupAdapter(this.adapter);
    this.user = new UsersAdapter(this.adapter);
  }
}
