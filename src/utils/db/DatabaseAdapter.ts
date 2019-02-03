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
          privateKey:
            // tslint:disable-next-line:max-line-length
            '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC4ZdWqMvz1+Z6l\nlYvo9Hqg3bCMASuUfgk11XLLlrZE2ewkH9opjECwxcmLwdfTh9HRM0w6nl/OJ2E6\nv8oPqVEMN71+H4tuKWH5ZRy7rwUEaW3KqJb5zdvU16QL8Axr9IN66er51DG2HdkL\nVXFK1zHAB+s/HTK6cEuAHJEmdc7chDrsqTvxpcq+WVdfIbXE903JWWHcf0uX9KcA\nv6mKrw8LX79i2dKDcj085bZSQIUxzC+BlnV1Q9VFMtLLogGVipAh/El1Rr6l3RwC\ntNtSmRKIjn8+E3QA7PPjU96rACskbZiRIalx3jFkUZriuRVMXKYoaC9A3FpkpI/2\nKDEMFCI3AgMBAAECggEABFUzGEha229W5lVKBtFZhbskYVk5Z7XmJ1x19klop7dd\nu+PaSIpbDn6T1gFaGWr5FYHUI1udvx1ExNCOb43qcYr6nGKQXfGB/OmQ9KF0h6dd\nriPhjpOHqedMrdrYMQTpB2qyZPqOOnnEEcJSR2Ky8KL6bVNMGOwcJFZHgNl9qexZ\nwrPK5/T78AqVAISNKjwViB+sOIeeudrgJvTpy25Gektg+tSLutirgD407NJ5HV6J\nKRlvI7ixz5v/1rcSHiNQKUUX0trQnYOhYDz5tvgBBnJ5C+bZ8I3q/ECIkpOfuIkF\n3Rbyx1FwAeoPTJNjiEZHdphllSEL0QNqNSIEriOrIQKBgQD3mxinHqxWhg+GJcRm\nJlpq0KtXVSSxCCsUSsYTm3dryY38arCCOHJdC6FVbc/s5+GHsn6SGdCesGhmCrXh\nDGr7p1Cg5gdn0f3Iv2jfVBYINfwABmLNY6hDE3V8kOg+Uhr7RNbLsVI/9mpTZ5Dq\nlqolz548zaZ9+c+yLKYB380/YQKBgQC+piw/m40YC+8pNWbErWD4vP0pi+2jL8cm\nRy0OFOs0orPgK1wH8scO9NbkdK7f6uJ1DBaT7WPgww+mNrgxSpSfpquef65JXeIZ\nLu7lnseguEbYpANq/y86H3iyQm8Ined9Fnw232VhW7NgW/GJ3iMdOnkZs9VLrq3P\ndWyOc1vAlwKBgEOKjiYAKviLJy7rnHBU4/MhKqvu8MxNsxqc7v0oOmIvn8iL/cv3\nw9J3urGH++Deu9l9KiOGYS74ZfH31/ckoQY2dLr/JGQAlx6sf9nzoPLqbuw+0bK/\nDYYGh9TL3l4pnWyPMZxsqUgDWquXo6MqKA2aXcquOk1A2JP8s+fs+ZrhAoGAXlWD\nF4Y0bm2ZTV6rFy5jCTEaY3BliZWeiQY2+PzI1SacspNB2nz6mh/0JN7HmOx0WU49\n7bxM624ZVDlHMryghc7GpIqxBoR519QtSVkjlhcYlyGwv0S9bZkc87eDkVPwsyhp\nFg278EybmVZlUb6kyVWhjmI5bFVmk3ya1nGmOMkCgYEAlEoEEK+ghVYr+n6lh87j\nNPaKw+Cmsr0qYdJHgzJBjpTDngoCnVJ1gWbutfc9YbrcgxsnO7clBwziXnHy7Cso\nT8CFuwei+yuwnLZbkKcL5GbtDJPD4hXFwVkRILt9v1gOjzthMYaOx7Vgjj0unvqH\nrRIUC3JQsjftEZ1Pz1yIi1Y=\n-----END PRIVATE KEY-----\n'
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      })
      .database();

    this.group = new GroupAdapter(this.adapter);
    this.user = new UsersAdapter(this.adapter);
  }
}
