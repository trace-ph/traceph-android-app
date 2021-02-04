import {getAndroidId, getModel} from 'react-native-device-info';

import {getNode, insertNode} from '../apis/node';

export default function registerDevice(cancel) {
  return new Promise((resolve, reject) => {
    console.log('registering device');
    getAndroidId().then(androidId => {
	  let deviceModel = getModel();
      console.log('android id', androidId);
	  console.log('device model', deviceModel);
      getNodeId(androidId, deviceModel, cancel, resolve, reject);
    });
  });
}

const getNodeId = (device_id, device_model, cancel, resolve, reject) => {
  insertNode(device_id, device_model, cancel)
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
