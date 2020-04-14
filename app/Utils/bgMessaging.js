import firebase from '@react-native-firebase/app';
// Optional flow type
import {Notifications} from 'react-native-notifications';
import DBManager from "./DBManager";

export default async (message: RemoteMessage) => {
  console.log('message', message);
  // handle your message
  const notification =Notifications.postLocalNotification({
    body:DBManager.toArabicNumbers(message.data.body),
    title: 'جلسه جدید!',

  });
  //   new firebase.notifications.Notification();
  // notification.setNotificationId(new Date().getMilliseconds().toString());
  // notification.setData({date:message.data.body.substr(18,10)});
  // notification.android.setChannelId('civilCH');
  // notification.android.setSmallIcon('ic_launcher');
  // notification.android.setBigText(message.data.body);
  // firebase.notifications().displayNotification(notification);
  return Promise.resolve();
}