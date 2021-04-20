import MMKV from 'react-native-mmkv-storage';

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

export function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}