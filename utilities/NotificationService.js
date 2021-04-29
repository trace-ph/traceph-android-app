import PushNotification from "react-native-push-notification";

export default class NotificationService {
    //onNotificaitn is a function passed in that is to be called when a
    //notification is to be emitted.
  constructor(onNotification) {
    this.configure(onNotification);
    this.lastId = 0;

    this.createDefaultChannel();

    // Clear badge number at start
    PushNotification.getApplicationIconBadgeNumber(function (number) {
      if (number > 0)
        PushNotification.setApplicationIconBadgeNumber(0);
    });
    
    // PushNotification.getChannels(function(channels) {
    //   console.log(channels);
    // });
  }

  // Configure notifications
  configure(onNotification) {
    PushNotification.configure({
      onNotification: onNotification,

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true
      },

      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios'
    });
  }

  // Creates channels
  createDefaultChannel(){
    PushNotification.createChannel(
      {
        channelId: 'notifDPH-channel-id',
        channelName: `Notification channel`,
        vibrate: true,
      },
      // (created) => console.log(`createChannel 'notifDPH-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
  }


  // Shows notification
  localNotification(title, message) {
    this.lastId++;
    PushNotification.localNotification({
      channelId: 'notifDPH-channel-id',
      title: title, 
      message: message,
      smallIcon: 'ic_launcher_round',
      largeIcon: 'ic_launcher_round',
    });
  }

  checkPermission(cbk) {
    return PushNotification.checkPermissions(cbk);
  }

  cancelNotif() {
    PushNotification.cancelLocalNotifications({id: ''+this.lastId});
  }

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }
}