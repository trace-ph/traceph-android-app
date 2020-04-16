import {getAndroidId} from 'react-native-device-info';

import {getNode, insertNode} from '../apis/node';

export default function registerDevice(cancel) {
  return new Promise((resolve, reject) => {
    console.log('registering device');
    getAndroidId().then(androidId => {
      console.log('android id', androidId);
      getNodeId(androidId, cancel, resolve, reject);
    });
  });
}

const getNodeId = (device_id, cancel, resolve, reject) => {
  insertNode(device_id, cancel)
    .then(res => {
      console.log('fetched node id: ', res.data.node_id);
      resolve(res.data.node_id);
    })
    .catch(err => {
      if (err.response) {
        console.log('get node id failed.', err.response.status);
        console.log(err.response.data);
      }
      console.log('insert err', err);
      reject();
    });
};
