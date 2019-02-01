import firebase from 'firebase-admin';
import GroupAdapter from './adapters/GroupAdapter';

export default class DatabaseAdapter {
  public readonly group: GroupAdapter;

  protected readonly adapter: firebase.database.Database;

  constructor() {
    console.log('called');
    const serviceAccount = require('../../../config/firebase/services.json');
    this.adapter = firebase
      .initializeApp({
        credential: firebase.credential.cert(serviceAccount),
        databaseURL: 'https://line-wolf-id.firebaseio.com'
      })
      .database();

    this.group = new GroupAdapter(this.adapter);
  }
}
