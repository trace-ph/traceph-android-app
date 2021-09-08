import BackgroundTimer from 'react-native-background-timer';
import MMKV from 'react-native-mmkv-storage';
import moment from 'moment';

import { getNotif, sendNotif } from '../apis/notification';


export function pollServer(node_id, timeout){
  return new Promise((resolve, reject) => {
    getNotif({ node_id: node_id }, timeout)
      .then(res => {
        console.log('Exposed notification connected', [res.status]);
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function sendNotification(node_id){
  sendNotif({ node_id: node_id })
    .then((response) => console.log('Exposed notification confirmed', [response.status]));
}


// Saves the notification received in local storage
export async function saveNotif(message){
  // Initialize local storage and get notif counter
  let MmkvStore = new MMKV.Loader().withInstanceID('notificationLogs');
  MmkvStore = await MmkvStore.initialize();
  try {
    let notifList = JSON.parse(await MmkvStore.getStringAsync('notif'));  

    // Save notification messages
    notifList[moment(new Date()).format("MMM D, YYYY h:mm A")] = message;
    if(Object.keys(notifList).length > 3)    // Remove older messages
      delete notifList[Object.keys(notifList)[0]];

    await MmkvStore.setStringAsync('notif', JSON.stringify(notifList));

  } catch {
    let notifList = {};

    // Save notification messages
    notifList[moment(new Date()).format("MMM D, YYYY h:mm A")] = message;
    await MmkvStore.setStringAsync('notif', JSON.stringify(notifList));
  }
}

export function sleep(ms){
  return new Promise(resolve => BackgroundTimer.setTimeout(resolve, ms));
}