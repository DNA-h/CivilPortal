import firebase from 'react-native-firebase';
// Optional flow type
import type { RemoteMessage, Notification } from 'react-native-firebase';

export default async (message: RemoteMessage) => {
  console.log('message', message);
  // handle your message
  const notification = new firebase.notifications.Notification();
  notification.setNotificationId(new Date().getMilliseconds().toString());
  notification.setTitle('جلسه جدید!');
  notification.setBody(message.data.body);
  notification.setData({date:message.data.body.substr(18,10)});
  notification.android.setChannelId('civilCH');
  notification.android.setSmallIcon('ic_launcher');
  notification.android.setBigText(message.data.body);
  firebase.notifications().displayNotification(notification);
  return Promise.resolve();
}