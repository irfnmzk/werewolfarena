import firebase from 'firebase-admin';

export default class DatabaseAdapter {
  protected readonly adapter: firebase.database.Database;

  constructor() {
    const serviceAccount = require('../../../config/firebase/services.json');
    this.adapter = firebase
      .initializeApp({
        credential: firebase.credential.cert(serviceAccount),
        databaseURL: 'https://line-wolf-id.firebaseio.com'
      })
      .database();
  }
}
