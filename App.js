import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {
  NativeEventEmitter,
  NativeModules,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import BackgroundTimer from 'react-native-background-timer';
import BleManager from 'react-native-ble-manager';
import VIForegroundService from '@voximplant/react-native-foreground-service';
import GetLocation from 'react-native-get-location';
import MMKV from 'react-native-mmkv-storage';

import SharingScreen from './screens/sharingScreen';
import GreetingScreen from './screens/greetingScreen';
import AskBluScreen from './screens/askForBluetoothScreen';

import FxContext from './FxContext';

import {getNode, insertNode} from './apis/node';
import {insertContacts} from './apis/contact';

const Stack = createStackNavigator();

var Buffer = require('buffer/').Buffer;

const {BleModule, ToastModule} = NativeModules;

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const bleModuleEmitter = new NativeEventEmitter(BleModule);

const App = () => {
  const [isBleSupported, setIsBleSupported] = useState(false);
  const [isOnBackground, setIsOnBackground] = useState(false);
  const [currentDiscoveredDevices, setCurrentDiscoveredDevices] = useState([]);
  const [discoveryLog, setDiscoveryLog] = useState([]);
  const [recognizedDevices, setRecognizedDevices] = useState([]);

  var intervalRef = useRef(null);

  const currentDiscoveredDevicesRef = useRef();
  const discoveryLogRef = useRef();
  const isBleSupportedRef = useRef();
  const recognizedDevicesRef = useRef();
  const {mFunc, setMFunc} = useContext(FxContext);

  var MmkvStore = new MMKV.Loader().withInstanceID('bleDiscoveryLogs');

  useEffect(() => {
    //Starts BLEManager
    BleManager.start({showAlert: false});

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

    setMFunc({enableBluetooth, startMonitoring, stopMonitoring});
    registerDevice();
    initializeLocalStore();

    getLocation();
  }, []);

  useEffect(() => {
    discoveryLogRef.current = discoveryLog;
  }, [discoveryLog]);

  useEffect(() => {
    currentDiscoveredDevicesRef.current = currentDiscoveredDevices;
    //console.log('current Discovered Devices', currentDiscoveredDevices);
  }, [currentDiscoveredDevices]);

  useEffect(() => {
    isBleSupportedRef.current = isBleSupported;
  }, [isBleSupported]);

  useEffect(() => {
    recognizedDevicesRef.current = recognizedDevices;
  }, [recognizedDevices]);

  const initializeLocalStore = async () => {
    try {
      MmkvStore = await MmkvStore.initialize();
    } catch (err) {
      console.log('store initialization failed. ', err);
    }
  };

  const registerDevice = () => {
    //get node
    //if node exists, return
    //else, insert node
    var node_id = 'testAndroid';
    var device_id = 'android id';
    var person_id = 'debugger person';
    // getNode({node_id, device_id, person_id})
    //   .then(res => console.log('axios connected', res))
    //   .catch(err => {
    //     if (err.response) {
    //       console.log(err.response.data);
    //       console.log(err.response.status);
    //       console.log(err.response.headers);
    //     }
    //     console.log(err);
    //   });
    // insertNode({node_id, device_id, person_id})
    //   .then(res => console.log('axios connected', res))
    //   .catch(err => {
    //     if (err.response) {
    //       console.log(err.response.data);
    //       console.log(err.response.status);
    //       console.log(err.response.headers);
    //     }
    //     console.log('insert', err);
    //   });
    // insertContacts({
    //   contacts: [
    //     {
    //       type: 'direct-bluetooth',
    //       timestamp: '2020-03-01 01:01:01',
    //       source_node_id: 'c78775ed-2e4c-43fd-bd9c-90d203826212',
    //       node_pairs: ['c78775ed-2e4c-43fd-bd9c-90d203826212'],
    //       location: {
    //         type: 'Point',
    //         coordinates: [0],
    //       },
    //     },
    //   ],
    // })
    //   .then(res => console.log('axios connected', res))
    //   .catch(err => {
    //     if (err.response) {
    //       console.log(err.response.data);
    //       console.log(err.response.status);
    //       console.log(err.response.headers);
    //     }
    //     console.log('insert', err);
    //   });
  };

  const enableBluetooth = useCallback(
    () =>
      new Promise((resolve, reject) => {
        if (Platform.OS === 'android' && Platform.Version >= 23) {
          PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ).then(result => {
            if (result) {
              console.log('Android Permission is OK');
            } else {
              PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
              ).then(result => {
                if (result) {
                  console.log('User accept');
                } else {
                  console.log('User refuse');
                  reject();
                }
              });
            }
          });
        }
        //Enables Bluetooth
        BleManager.enableBluetooth()
          .then(() => {
            BleModule.isAdvertisingSupported(res => {
              setIsBleSupported(res);
            });
            console.log('The bluetooth is already enabled or the user confirm');
            setTimeout(() => resolve(), 1000);
          })
          .catch(error => {
            ToastModule.showToast("Can't operate without bluetooth.");
            console.log('The user refuse to enable bluetooth');
            reject();
          });
      }),
    [],
  );

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

  const stopForegroundService = async () => {
    let returnVal = false;
    await VIForegroundService.stopService()
      .then(() => {
        returnVal = true;
      })
      .catch(() => {
        returnVal = false;
      });
    return returnVal;
  };

  const stopMonitoring = useCallback(
    () =>
      new Promise((resolve, reject) => {
        stopAdvertising();
        stopTimer();
        if (stopForegroundService()) resolve();
        else reject();
      }),
    [],
  );

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

  const startTimer = useCallback(
    () =>
      new Promise((resolve, reject) => {
        setIsOnBackground(true);
        intervalRef.current = BackgroundTimer.setInterval(async () => {
          const deviceToConnect = [];
          const temp_recognizedDevices = [...recognizedDevicesRef.current];
          console.log('recognizedDevices', temp_recognizedDevices);
          console.log('discovery log', discoveryLogRef.current);

          const segregateList = item =>
            new Promise(resolve => {
              if (item.data === '') {
                deviceToConnect.push(item);
              } else if (item.data === 'Handshake') {
                temp_recognizedDevices.push(item);
              }

              resolve();
            });

          currentDiscoveredDevicesRef.current.forEach(async item => {
            function checkIfRecognized(obj) {
              return obj.id === item.id;
            }
            let isRecognized = temp_recognizedDevices.some(checkIfRecognized);
            //console.log(item.id, 'is recognized', isRecognized);
            if (!isRecognized) {
              await segregateList(item);
            }
          });

          for (let i = 0; i < deviceToConnect.length; i++) {
            let isConnected = false;
            var id = deviceToConnect[i].id;
            //console.log('connecting to device ', id);
            await BleManager.connect(id)
              .then(() => {
                //console.log('Connected to ', id);
                isConnected = true;
              })
              .then(() => {
                return BleManager.retrieveServices(id);
              })
              .then(info => {
                //console.log('Retrieved services of peripheral: ', id, info);
              })
              .then(async () => {
                //console.log('reading data from ', id);
                await BleManager.read(
                  id,
                  '0000ff01-0000-1000-8000-00805F9B34FB',
                  '0000ff01-0000-1000-8000-00805F9B34FB',
                )
                  .then(readData => {
                    var buffer = Buffer.from(readData);
                    const serviceData = buffer.toString();
                    //set the serviceData to data
                    deviceToConnect[i].data = serviceData;
                    temp_recognizedDevices.push(deviceToConnect[i]);
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
          setRecognizedDevices(temp_recognizedDevices);

          var localStorage = [];
          try {
            localStorage = (await MmkvStore.getArrayAsync('discLogs')) || [];
            console.log('local storage: ', localStorage);
          } catch (err) {
            console.log('local storage not found', err);
          }
          discoveryLogRef.current.forEach(val => {
            function checkIfOnRecognized(obj) {
              return obj.id === val.id;
            }
            let recogDevIndex = temp_recognizedDevices.findIndex(
              checkIfOnRecognized,
            );
            if (recogDevIndex >= 0) {
              val.data = temp_recognizedDevices[recogDevIndex].data;
              val.txPower = temp_recognizedDevices[recogDevIndex].txPower;
              localStorage.push(val);
            }
          });
          try {
            await MmkvStore.setArrayAsync('discLogs', localStorage);
          } catch (err) {
            console.log('local storage cant update', err);
          }
          setCurrentDiscoveredDevices([]);
          setDiscoveryLog([]);
          startScan(false);
        }, 7000);

        if (intervalRef.current) {
          console.log('timer started');
          resolve();
        } else {
          reject();
        }
      }),
    [],
  );

  const stopTimer = useCallback(() => {
    setIsOnBackground(false);
    BackgroundTimer.clearInterval(intervalRef.current);
  }, []);

  const startAdvertising = () =>
    new Promise((resolve, reject) => {
      if (isBleSupportedRef.current) {
        BleModule.advertise('', (res, err) => {
          if (res) {
            console.log('advertising');
            resolve();
          }
        });
      } else {
        reject();
      }
    });

  const startServer = () =>
    new Promise((resolve, reject) => {
      if (isBleSupportedRef.current) {
        BleModule.startServer((res, err) => {
          if (res) {
            console.log('gatt started');
            resolve();
          }
        });
      } else {
        reject();
      }
    });

  const stopAdvertising = () => {
    BleModule.stopBroadcastingGATT((res, res1, err) => {
      // if (res) setIsAdvertising(false);
    });
  };

  const startScan = isUseUuid =>
    new Promise((resolve, reject) => {
      let scanUuids = [];
      if (isUseUuid) scanUuids = ['0000ff01-0000-1000-8000-00805F9B34FB'];
      BleManager.scan(scanUuids, 3, true, {
        matchMode: 1,
        numberOfMatches: 1,
      })
        .then(results => {
          console.log('Start scan');
          resolve();
        })
        .catch(() => {
          reject();
        });
    });

  const handleStopScan = () => {
    console.log('Scan done.');
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

    function checkIfExistInLog(obj) {
      return obj.id === peripheral.id && obj.time === timeStamp;
    }

    let logLength = discoveryLogRef.current.length;
    let isPeripheralExisting = discoveryLogRef.current.some(checkIfExistInLog);

    if (logLength === 0 || !isPeripheralExisting) {
      //log only records the device id, rssi, and time;
      //the identity(data) will be referenced from discoveredDevices
      setDiscoveryLog(currArr => {
        let temp_currArr = [...currArr];
        temp_currArr.push({
          id: peripheral.id,
          rssi: peripheral.rssi,
          time: timeStamp,
        });
        //console.log(peripheral.id, serviceData, timeStamp);
        return temp_currArr;
      });

      setCurrentDiscoveredDevices(currentArr => {
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
          });
        }

        return temp_currentArr;
      });
    }
  };

  const startMonitoring = useCallback(
    () =>
      new Promise(async (resolve, reject) => {
        startAdvertising()
          .then(() => startServer())
          .then(() => startTimer())
          .then(() => startScan(false))
          .then(() => startForegroundService())
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      }),
    [],
  );

  const handleConsoleLog = msg => {
    console.log('from native: ', 'msg');
  };

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Greet" headerMode="none">
          <Stack.Screen name="Greet" component={GreetingScreen} />
          <Stack.Screen name="askForBluetooth" component={AskBluScreen} />
          <Stack.Screen name="Sharing" component={SharingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
