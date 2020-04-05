import React, {useEffect, useState, useRef, useCallback} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

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
  Image,
  Linking,
  Dimensions,
  Clipboard,
} from 'react-native';

import {SvgUri} from 'react-native-svg';

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
import AsyncStorage from '@react-native-community/async-storage';
import BleManager from 'react-native-ble-manager';
import VIForegroundService from '@voximplant/react-native-foreground-service';

import SharingScreen from './screens/sharingScreen';

import GetLocation from 'react-native-get-location';

const Stack = createStackNavigator();

var Buffer = require('buffer/').Buffer;

const {BleModule, ToastModule} = NativeModules;

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const bleModuleEmitter = new NativeEventEmitter(BleModule);

const App = () => {
  const [isAdvertising, setIsAdvertising] = useState(false);
  const [isOnGATT, setIsOnGATT] = useState(false);
  const [list, setList] = useState([]);
  const [isBleSupported, setIsBleSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isOnBackground, setIsOnBackground] = useState(false);
  const [deviceName, setDeviceName] = useState('Handshake');
  const [gattUuid, setGattUuid] = useState('');
  const [advSettings, setAdvSettings] = useState('null');

  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [discoveryLog, setDiscoveryLog] = useState([]);

  const peripherals_ = new Map();
  const peripherals_history = new Map();

  var intervalRef = useRef(null);

  const discoveredDevicesRef = useRef();
  const discoveryLogRef = useRef();

  useEffect(() => {
    //Starts BLEManager
    BleManager.start({showAlert: false});

    //Enables Bluetooth
    BleManager.enableBluetooth()
      .then(() => {
        BleModule.isAdvertisingSupported(res => {
          setIsBleSupported(res);
        });
        console.log('The bluetooth is already enabled or the user confirm');
      })
      .catch(error => {
        ToastModule.showToast('Error: The app needs bluetooth.');
        console.log('The user refuse to enable bluetooth');
      });

    const handlerDiscover = bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );

    const handlerStopScan = bleManagerEmitter.addListener(
      'BleManagerStopScan',
      handleStopScan,
    );

    const debuggingHandler = bleModuleEmitter.addListener(
      'forConsoleLogging',
      handleConsoleLog,
    );

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ).then(result => {
        if (result) {
          getLocation();
          console.log('Android Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ).then(result => {
            if (result) {
              getLocation();
              console.log('User accept');
            } else {
              console.log('User refuse');
            }
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    discoveryLogRef.current = discoveryLog;
  }, [discoveryLog]);

  useEffect(() => {
    //console.log('this is the list', list);
  }, [list]);

  useEffect(() => {
    discoveredDevicesRef.current = discoveredDevices;
    //find value in array with no serviceData
    //connect
  }, [discoveredDevices]);

  const startForegroundService = async () => {
    if (Platform.Version >= 26) {
      const channelConfig = {
        id: 'TracePHServiceChannel',
        name: 'TracePH Channel',
        description: 'Notification Channel for TracePH',
        enableVibration: false,
        importance: 2,
      };
      await VIForegroundService.createNotificationChannel(channelConfig);
    }

    const notificationConfig = {
      id: 9811385,
      title: 'TracePH Active',
      text: 'The app is running in the background.',
      icon: 'ic_launcher_round',
    };
    if (Platform.Version >= 26) {
      notificationConfig.channelId = 'TracePHServiceChannel';
    }
    try {
      await VIForegroundService.startService(notificationConfig);
      console.log('service good.');
    } catch (e) {
      console.error(e);
    }
  };

  const stopForegroundService = () => {
    VIForegroundService.stopService();
  };

  const getLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        console.log(location);
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
  };

  const startTimer = useCallback(() => {
    setIsOnBackground(true);
    intervalRef.current = BackgroundTimer.setInterval(async () => {
      console.log('on Timer discover prevVal', discoveredDevicesRef.current);

      const checkData = item => {
        return item.data === '';
      };

      const deviceToConnect = discoveredDevicesRef.current.filter(checkData);

      for (let i = 0; i < deviceToConnect.length; i++) {
        let isConnected = false;
        var id = deviceToConnect[i].id;
        console.log('connecting to device ', id);
        await BleManager.connect(id)
          .then(() => {
            console.log('Connected to ', id);
            isConnected = true;
          })
          .then(() => {
            return BleManager.retrieveServices(id);
          })
          .then(info => {
            console.log('Retrieved services of peripheral: ', id, info);
          })
          .then(() => {
            console.log('reading data from ', id);
            BleManager.read(
              id,
              '0000ff01-0000-1000-8000-00805F9B34FB',
              '0000ff01-0000-1000-8000-00805F9B34FB',
            )
              .then(readData => {
                var buffer = Buffer.from(readData);
                const serviceData = buffer.toString();
                console.log('received service data ', serviceData);
              })
              .catch(err => {
                console.log('read error', err);
              })
              .finally(() => {
                if (isConnected) {
                  BleManager.disconnect(id, true)
                    .then(() => {
                      isConnected = false;
                    })
                    .catch(err => {
                      console.log('disconnect error', err);
                    });
                }
              });
          })
          .catch(error => {
            console.log('getting Service Data failed: ', error);
            if (isConnected) {
              BleManager.disconnect(id, true)
                .then(() => {
                  isConnected = false;
                })
                .catch(err => {
                  console.log('disconnect error', err);
                });
            }
          });
      }
      console.log('end of interval');

      if (list.length > 0) {
        setList([]);
      }
      startScan();
    }, 5000);
  }, []);

  const stopTimer = useCallback(() => {
    setIsOnBackground(false);
    BackgroundTimer.clearInterval(intervalRef.current);
  }, []);

  const startAdvertising = () => {
    if (isBleSupported) {
      BleModule.advertise(deviceName, (res, err) => {
        if (res) {
          setIsAdvertising(true);
          setAdvSettings(err);
        }
      });
    } else console.log('Not supported.');
  };

  const copyToClipboard = () => {
    Clipboard.setString('https://endcov.ph/');
    ToastModule.showToast('Copied to Clipboard');
  };

  const startServer = () => {
    if (isBleSupported) {
      BleModule.startServer((res, err) => {
        if (res) {
          setIsOnGATT(true);
          setGattUuid(err);
        }
      });
    } else console.log('Not supported.');
  };

  const stopAdvertising = () => {
    BleModule.stopBroadcastingGATT((res, res1, err) => {
      if (res) setIsAdvertising(false);
    });
  };

  const startScan = () => {
    setIsScanning(true);
    BleManager.scan([], 3, true, {
      matchMode: 1,
      numberOfMatches: 1,
    }).then(results => {
      console.log('Start scan');
    });
  };

  const handleStopScan = () => {
    setIsScanning(false);
    let list_temp = Array.from(peripherals_.values());
    setList(list_temp);

    console.log('Scan done.');

    list_temp = [];
    peripherals_.clear();
  };

  const handleDiscoverPeripheral = peripheral => {
    var serviceData = '';
    let date = new Date().getDate(); //Current Date
    let month = new Date().getMonth() + 1; //Current Month
    let year = new Date().getFullYear(); //Current Year
    let hours = new Date().getHours(); //Current Hours
    let min = new Date().getMinutes(); //Current Minutes
    let sec = new Date().getSeconds(); //Current Seconds
    let timeStamp =
      date + '/' + month + '/' + year + ' ' + hours + ':' + min + ':' + sec;

    //temporary; to be removed
    peripherals_.set(peripheral.id, peripheral);
    let logLength = discoveryLogRef.current.length;
    if (
      logLength === 0 ||
      discoveryLogRef.current[discoveryLogRef.current.length - 1].id !==
        peripheral.id ||
      discoveryLogRef.current[discoveryLogRef.current.length - 1].time !==
        timeStamp
    ) {
      setDiscoveryLog(currArr => {
        let temp_currArr = [...currArr];
        temp_currArr.push({
          id: peripheral.id,
          data: serviceData,
          txPower: peripheral.advertising.txPowerLevel,
          rssi: peripheral.rssi,
          time: timeStamp,
        });
        console.log(peripheral.id, serviceData, timeStamp);
        return temp_currArr;
      });

      setDiscoveredDevices(currentArr => {
        let temp_currentArr = [...currentArr];

        const checkIfIdExist = item => {
          return item.id === peripheral.id;
        };

        if (temp_currentArr.findIndex(checkIfIdExist) === -1) {
          //get the advertisement data
          if (peripheral.advertising.serviceData.hasOwnProperty('ff01')) {
            var buffer = Buffer.from(
              peripheral.advertising.serviceData.ff01.bytes,
            );
            serviceData = buffer.toString();
          }

          temp_currentArr.push({
            id: peripheral.id,
            data: serviceData,
            txPower: peripheral.advertising.txPowerLevel,
            rssi: peripheral.rssi,
            time: timeStamp,
          });
        }

        return temp_currentArr;
      });
    }
  };

  const handleConsoleLog = msg => {
    console.log('from native: ', 'msg');
  };

  const PeripheralListItem = props => {
    const {item = {advertising: {}}} = props;
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
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" headerMode="none">
          <Stack.Screen name="Home" component={SharingScreen} />
          <Stack.Screen name="Sharing" component={SharingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
