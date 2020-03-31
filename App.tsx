/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import { Text, Button, NativeEventEmitter, NativeModules} from 'react-native';
import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const App = () => {
  useEffect(() => {
    BleManager.enableBluetooth();
    BleManager.start({ showAlert: false, forceLegacy: true }).then(() => {
      console.log('Starting...');
    });
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', devices => {
      console.log(devices);
    });
  });

  const callForScan = () => {
    BleManager.scan([], 30, true).then(() => {
      console.log('Scanning...');
    });
  };

  const checkConnected = () => {
    BleManager.getConnectedPeripherals([])
      .then((peripheralsArray) => {
        console.log(peripheralsArray);
        console.log('Connected peripherals: ' + peripheralsArray.length);
      });

    BleManager.getBondedPeripherals([])
      .then((bondedPeripheralsArray:any) => {
        console.log(bondedPeripheralsArray);
        console.log('Bonded peripherals: ' + bondedPeripheralsArray.length);
      });

    BleManager.getDiscoveredPeripherals()
      .then(devices => {
        console.log('Founded devices: ', devices);
      });

  };

  return (
    <>
      <Button
        onPress={callForScan}
        title="scan"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      <Button
        onPress={checkConnected}
        title="check connected"
        color="red"
        accessibilityLabel="Learn more about this purple button"
      />
      <Text>TracePH</Text>
    </>
  );
};

export default App;
