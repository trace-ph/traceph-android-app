import { useContext } from 'react';

import { getNotif } from '../apis/notification';
import NotificationService from './NotificationService.js';


// Get notification from server
export default async function getNotification(node_id) {
  console.log('Getting notification...');

  // Initialized notification service
  const notification = new NotificationService(function(notif){
    console.log("NOTIF: ", notif);
  });

  // Create notification
  let title = 'You\'ve been exposed';
  let message = await pollServer(node_id);
  await notification.localNotification(title, message);
  
  // Calls function again
  getNotification(node_id);
  return;
}


function pollServer(node_id){
  return new Promise((resolve, reject) => {
    getNotif({ node_id: node_id })
      .then(res => {
        console.log('axios connected', [res.status]);
        resolve(res.data);
      })
      .catch(err => {
        if (err.response) {
          console.log('notif error', err.response.status, err.response.data);
          reject();
        }
      });
  });
}