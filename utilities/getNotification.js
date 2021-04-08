import { useContext } from 'react';

import { getNotif } from '../apis/notification';
import NotificationService from './NotificationService.js';

let delay = 1000 * 60;        // 1 second * multiplier


// Get notification from server
export default async function getNotification(node_id) {
  console.log('Getting notification...');

  // Initialized notification service
  const notification = new NotificationService(function(notif){
    console.log("NOTIF: ", notif);
  });

  // Create notification
  let title = 'You\'ve been exposed';
  pollServer(node_id)
    .then(async (message) => {  
      await notification.localNotification(title, message);

      // Calls function again after 1 minute
      sleep(delay).then(() => getNotification(node_id));
      return;
    })
    .catch((err) => {
      console.error(err);
      return;
    });
}


function pollServer(node_id){
  return new Promise((resolve, reject) => {
    getNotif({ node_id: node_id })
      .then(res => {
        console.log('axios connected', [res.status]);
        resolve(res.data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}