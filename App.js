/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  StatusBar,
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  AppState,
  Platform,
  SafeAreaView,
  View,
  Text,
  FlatList,
} from 'react-native';

const {BleModule} = NativeModules;

import {Button, Card, WhiteSpace, WingBlank} from '@ant-design/react-native';

import BleManager from 'react-native-ble-manager';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

import {Colors} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const [peripherals, setPeripherals] = useState(new Map());
  const [isAdvertising, setIsAdvertising] = useState(false);
  const [isOnGATT, setIsOnGATT] = useState(false);
  const [list, setList] = useState([]);
  const [isBleSupported, setIsBleSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isOnBackground, setIsOnBackground] = useState(false);
  useEffect(() => {
    BleManager.start({showAlert: false}).then(() => {
      // Success code
      console.log('Module initialized');
    });

    const handlerDiscover = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );

    const handlerStop = bleManagerEmitter.addListener(
      'BleManagerStopScan',
      handleStopScan,
    );

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ).then(result => {
            if (result) {
              console.log('User accept');
            } else {
              console.log('User refuse');
            }
          });
        }
      });
    }

    BleModule.isAdvertisingSupported(res => {
      console.log('isSupported?', res);
      setIsBleSupported(res);
    });
  }, []);

  useEffect(() => {
    console.log(render_map.length);
  }, [list]);

  useEffect(() => {
    console.log(isBleSupported);
  }, [isBleSupported]);

  const startAdvertising = () => {
    if (isBleSupported) {
      BleModule.advertise((res, err) => {
        console.log('ads status', res, err);
        if (res) setIsAdvertising(true);
      });
      BleModule.startServer((res, err) => {
        console.log('serv status', res, err);
        if (res) setIsOnGATT(true);
      });
    } else console.log('Not supported.');
  };

  const stopAdvertising = () => {
    BleModule.stopBroadcastingGATT((res, res1, err) => {
      console.log('stop advertisement?', res, res1, err);
      if (res) setIsAdvertising(false);
    });
  };

  const startScan = () => {
    if (list.length > 0) {
      let peripherals_temp = peripherals.clear();
      setPeripherals(peripherals_temp);
      setList([]);
    }

    setIsScanning(true);
    BleManager.scan([], 3, true).then(results => {
      console.log('Scanning...');
    });
  };

  const handleStopScan = () => {
    console.log('Scan done.');
    setIsScanning(false);
    let list_temp = Array.from(peripherals.values());
    setList(list_temp);
  };

  const handleDiscoverPeripheral = peripheral => {
    console.log('got signal', peripheral.id);
    let peripherals_temp = peripherals;
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    //peripheral contains //advertising.serviceUUIDs [] //id //name //rssi
    peripherals_temp.set(peripheral.id, peripheral);
    setPeripherals(peripherals_temp);
  };

  const PeripheralListItem = props => {
    const {item = {advertising: {}}} = props;
    console.log(item);
    return (
      <React.Fragment>
        <WhiteSpace size="lg" />
        <WingBlank size="lg">
          <Card>
            <Card.Header title={item.name} />
            <Card.Body>
              <View style={{height: 50}}>
                <Text style={{marginLeft: 16}}>id: {item.id}</Text>
                <Text style={{marginLeft: 16}}>
                  UUIDs: {item.advertising.serviceUUIDs}
                </Text>
                <Text style={{marginLeft: 16}}>RSSI: {item.rssi}</Text>
              </View>
            </Card.Body>
          </Card>
        </WingBlank>
      </React.Fragment>
    );
  };

  let temp_arr = [
    {
      advertising: {
        isConnectable: false,
        manufacturerData: [Object],
        serviceData: [Object],
        serviceUUIDs: [Array],
        txPowerLevel: -2147483648,
      },
      id: '16:C7:03:D3:AD:1E',
      name: 'NO NAME',
      rssi: -28,
    },
  ];

  let render_map = list.map((listItem, index) => {
    return <PeripheralListItem item={listItem} id={index} />;
  });

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <WhiteSpace size="lg" />
        <WingBlank size="sm">
          {!isOnBackground ? (
            <Button
              onPress={() => setIsOnBackground(true)}
              style={{borderRadius: 30}}
              type="primary"
              disabled>
              Start Background
            </Button>
          ) : (
            <Button
              onPress={() => setIsOnBackground(false)}
              style={{borderRadius: 30}}
              type="warning">
              Stop Background
            </Button>
          )}
        </WingBlank>
        <WhiteSpace size="lg" />
        <WingBlank size="sm">
          {!isAdvertising ? (
            <Button
              onPress={() => startAdvertising()}
              style={{borderRadius: 30}}
              type="primary">
              Start Advertising
            </Button>
          ) : (
            <Button
              onPress={() => stopAdvertising()}
              style={{borderRadius: 30}}
              type="warning">
              Stop Advertising
            </Button>
          )}
        </WingBlank>
        <WhiteSpace size="lg" />
        <WingBlank size="sm">
          {isScanning ? (
            <Button style={{borderRadius: 30}} type="primary" loading disabled>
              Scanning...
            </Button>
          ) : (
            <Button
              style={{borderRadius: 30}}
              type="primary"
              onPress={() => startScan()}>
              Scan
            </Button>
          )}
        </WingBlank>
        <WhiteSpace size="md" />
        <WingBlank size="lg">
          {isOnGATT ? <Text>GATT Server running.</Text> : null}
          <Text># of devices detected: {list.length}</Text>
        </WingBlank>
        <FlatList
          data={list}
          renderItem={({item}) => <PeripheralListItem item={item} />}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({});

export default App;
