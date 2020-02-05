import firebase from 'react-native-firebase';
// Optional flow type
import type {RemoteMessage, Notification} from 'react-native-firebase';

export default async (message: RemoteMessage) => {
  console.log('message', message);
  // handle your message
  const notification = new firebase.notifications.Notification()
    .android.setChannelId('civil-channel')
    .android.setBigText(message.data.body)
    .android.setSmallIcon("launch_screen")
    .setNotificationId(new Date().getMilliseconds().toString())
    .setTitle('جلسه جدید!')
    .setBody(message.data.body);
  firebase.notifications().displayNotification(notification);
  return Promise.resolve();
}