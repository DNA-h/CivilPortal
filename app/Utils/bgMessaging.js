import firebase from 'react-native-firebase';
// Optional flow type
import type { RemoteMessage, Notification } from 'react-native-firebase';

export default async (message: RemoteMessage) => {
  console.log('message', message);
  // handle your message
  const notification = new firebase.notifications.Notification();
  notification.setNotificationId('notificationId');
  notification.setTitle('جلسه جدید!');
  notification.setBody(message.data.body);
  notification.android.setChannelId('channelId');
  notification.android.setSmallIcon('ic_launcher');
  notification.android.setBigText(message.data.body);
  firebase.notifications().displayNotification(notification);
  return Promise.resolve();
}