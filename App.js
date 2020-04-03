import React, {useEffect, useState, useRef, useCallback} from 'react';
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
  ScrollView,
} from 'react-native';

import {
  ActivityIndicator,
  Button,
  Card,
  Flex,
  WhiteSpace,
  WingBlank,
  TextareaItem,
} from '@ant-design/react-native';

import BackgroundTimer from 'react-native-background-timer';

import BleManager from 'react-native-ble-manager';

const {BleModule} = NativeModules;

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const App = () => {
  const [peripherals, setPeripherals] = useState(new Map());
  const [isAdvertising, setIsAdvertising] = useState(false);
  const [isOnGATT, setIsOnGATT] = useState(false);
  const [list, setList] = useState([]);
  const [isBleSupported, setIsBleSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isOnBackground, setIsOnBackground] = useState(false);
  const [isName, setIsName] = useState(false);
  const [gattUuid, setGattUuid] = useState('');
  const [advSettings, setAdvSettings] = useState('null');

  var intervalRef = useRef(null);

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

  const toggleName = () => {
    setIsName(curr => !curr);
  };

  const startTimer = useCallback(() => {
    setIsOnBackground(true);
    intervalRef.current = BackgroundTimer.setInterval(() => {
      startScan();
    }, 5000);
    console.log(typeof timeoutId);
  }, []);

  const stopTimer = useCallback(() => {
    setIsOnBackground(false);
    BackgroundTimer.clearInterval(intervalRef.current);
  }, []);

  const startAdvertising = () => {
    if (isBleSupported) {
      BleModule.advertise(isName, (res, err) => {
        console.log('ads status', res, err);
        if (res) {
          setIsAdvertising(true);
          setAdvSettings(err);
        }
      });
    } else console.log('Not supported.');
  };

  const startServer = () => {
    if (isBleSupported) {
      BleModule.startServer((res, err) => {
        console.log('serv status', res, err);
        if (res) {
          setIsOnGATT(true);
          setGattUuid(err);
        }
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
              <View style={{minHeight: 50}}>
                <Text style={{marginLeft: 16}}>id: {item.id}</Text>
                <Text style={{marginLeft: 16}}>
                  UUIDs: {item.advertising.serviceUUIDs}
                </Text>
                <Text style={{marginLeft: 16}}>
                  TX Power Lvl: {item.advertising.txPowerLevel}
                </Text>
                <Text style={{marginLeft: 16}}>RSSI: {item.rssi}</Text>
                <Text style={{marginLeft: 16}}>
                  Data: {item.advertising.data}
                </Text>
              </View>
            </Card.Body>
          </Card>
        </WingBlank>
      </React.Fragment>
    );
  };

  let render_map = list.map((listItem, index) => {
    return <PeripheralListItem item={listItem} id={index} />;
  });

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView>
        <WhiteSpace size="lg" />
        <WingBlank size="sm">
          {!isAdvertising ? (
            <React.Fragment>
              {!isName ? (
                <Button
                  onPress={() => {
                    toggleName();
                  }}
                  style={{borderRadius: 30}}
                  type="primary">
                  Include Name in advertisement
                </Button>
              ) : (
                <Button
                  onPress={() => {
                    toggleName();
                  }}
                  style={{borderRadius: 30}}
                  type="warning">
                  Exclude Name in advertisement
                </Button>
              )}
              <WhiteSpace size="lg" />
              <Button
                onPress={() => startAdvertising()}
                style={{borderRadius: 30}}
                type="primary">
                Start Advertising
              </Button>
            </React.Fragment>
          ) : (
            <TextareaItem
              value={`Advertisement running. \n ${advSettings}`}
              editable={false}
              autoHeight
              style={{paddingVertical: 5}}
            />
          )}
        </WingBlank>
        <WhiteSpace size="lg" />
        <WingBlank size="lg">
          {!isOnGATT ? (
            <Button
              onPress={() => {
                startServer();
              }}
              style={{borderRadius: 30}}
              type="primary">
              Start GATT Server
            </Button>
          ) : (
            <React.Fragment>
              <Text>GATT Server running.</Text>
              <Text>UUID: {gattUuid}</Text>
            </React.Fragment>
          )}
        </WingBlank>
        <WhiteSpace size="lg" />
        <WingBlank size="sm">
          {!isOnBackground ? (
            <Button
              onPress={() => {
                startTimer();
                startScan();
              }}
              style={{borderRadius: 30}}
              type="primary">
              Start Scan
            </Button>
          ) : (
            <Button
              onPress={() => {
                stopTimer();
              }}
              style={{borderRadius: 30}}
              type="warning">
              Stop Scan
            </Button>
          )}
        </WingBlank>
        <WhiteSpace size="lg" />
        <WhiteSpace size="md" />
        <WingBlank size="lg">
          <Flex direction="column">
            {isScanning ? (
              <React.Fragment>
                <ActivityIndicator size="large" />
                <Text>Scanning Devices</Text>
              </React.Fragment>
            ) : (
              <Text># of devices detected: {list.length}</Text>
            )}
          </Flex>
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
