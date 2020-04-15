import {getAndroidId} from 'react-native-device-info';

import {getNode, insertNode} from '../apis/node';

export default function registerDevice() {
  return new Promise((resolve, reject) => {
    console.log('registering device');
    getAndroidId().then(androidId => {
      console.log('android id', androidId);
      //getNodeId(androidId, resolve, reject);
      //FIXME temporary android id
      getNodeId('AA:BB:CC:DD:EE:03', resolve, reject);
    });
  });
}

const getNodeId = (device_id, resolve, reject) => {
  insertNode(device_id)
    .then(res => {
      console.log('axios connected', res);
      resolve(res.data.node_id);
    })
    .catch(err => {
      if (err.response) {
        console.log('get node id failed.', err.response.status);
        console.log(err.response.data);
        reject();
      }
      console.log('insert', err);
    });
};
