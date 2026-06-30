import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';

// 通知が届いたときの表示設定
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false, // アプリ内では独自UIで表示するので非表示
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const listenerRef = useRef(null);

  useEffect(() => {
    // 通知権限をリクエスト
    const requestPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to recieve notifications has been denied');
      }
    };
    requestPermission();

    // 通知を受信したときのリスナー
    listenerRef.current = Notifications.addNotificationReceivedListener(notification => {
      const { title, body, data } = notification.request.content;
      const appName = data?.appName ?? notification.request.trigger?.type ?? 'App';

      setNotifications(prev => {
        const newNotif = {
          id: notification.request.identifier,
          app: appName,
          title: title ?? '',
          body: body ?? '',
          time: new Date(),
        };
        // 最大5件まで表示
        return [newNotif, ...prev].slice(0, 5);
      });
    });

    return () => {
      listenerRef.current?.remove();
    };
  }, []);

  // 個別削除
  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    Notifications.dismissNotificationAsync(id);
  };

  // 全削除
  const dismissAll = () => {
    setNotifications([]);
    Notifications.dismissAllNotificationsAsync();
  };

  return { notifications, dismissNotification, dismissAll };
}