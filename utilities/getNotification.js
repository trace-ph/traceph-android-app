import MMKV from 'react-native-mmkv-storage';

import { getNotif, sendNotif } from '../apis/notification';
import NotificationService from './NotificationService.js';

let delay = 1000 * 60;        // 1 minute


// Get notification from server
// Non-zero timeout are for the background notifications
export default function getNotification(node_id, timeout = 0) {
  console.log('Getting notification...');

  // Initialized notification service
  const notification = new NotificationService(function(notif){
    console.log("NOTIF: ", notif);
  });

  // Create notification
  let title = 'You\'ve been exposed';
  pollServer(node_id, timeout)
    .then(async (message) => {  
      await notification.localNotification(title, message);       // Show notification
      
      // Send confirmation
      sendNotif({ node_id: node_id })
        .then((response) => console.log('Exposed notification confirmed', [response.status]));

      saveNotif(message);

      if(timeout == 0)    // Calls function again after 1 minute
        sleep(delay).then(() => getNotification(node_id));
      
      return;
    })
    .catch((err) => {
      if(timeout == 0)    // Calls function again after 1 minute to re-attempt
        sleep(delay).then(() => getNotification(node_id));
      
      console.error(err);
      return;
    });
}


function pollServer(node_id, timeout){
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


// Saves the notification received in local storage
async function saveNotif(message){
  // Initialize local storage and get notif counter
  let MmkvStore = new MMKV.Loader().withInstanceID('notificationLogs');
  MmkvStore = await MmkvStore.initialize();
  try {
    let notifList = JSON.parse(await MmkvStore.getStringAsync('notif'));

    // Save notification messages
    notifList[formatDate(new Date())] = message;
    if(Object.keys(notifList).length > 3)    // Remove older messages
      delete notifList[Object.keys(notifList)[0]];

    await MmkvStore.setStringAsync('notif', JSON.stringify(notifList));

  } catch {
    let notifList = {};

    // Save notification messages
    notifList[formatDate(new Date())] = message;
    await MmkvStore.setStringAsync('notif', JSON.stringify(notifList));
  }
}


const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function formatDate(createdDate){
	let m = month[createdDate.getMonth()];
	let d = createdDate.getDate();
	let y = createdDate.getFullYear();
	let h = createdDate.getHours();
	let min = createdDate.getMinutes();
	if(h > 12 && (h % 12) != 0)
		return date = m + ' ' + d + ', ' + y + ' ' + (h % 12) + ':' + min + 'PM';
	else if(h > 12 && (h % 12) == 0)
		return date = m + ' ' + d + ', ' + y + ' 12:' + min + 'PM';
	else if(h < 12 && h != 0)
		return date = m + ' ' + d + ', ' + y + ' ' + h + ':' + min + 'AM';
	else
		return date = m + ' ' + d + ', ' + y + ' 12:' + min + 'AM';
}

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}