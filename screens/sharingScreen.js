import React, {useEffect, useContext, useState} from 'react';
import {
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text,
  ScrollView,
  Image,
  Linking,
  Dimensions,
  Clipboard,
  NativeModules,
} from 'react-native';

const {ToastModule} = NativeModules;

import {Button, Flex, WhiteSpace, WingBlank} from '@ant-design/react-native';

import FxContext from '../FxContext';

import Header from '../assets/header.svg';
const qrImg = require('../assets/qr.png');

const copyToClipboard = () => {
  Clipboard.setString('https://endcov.ph/');
  ToastModule.showToast('Copied to Clipboard');
};

export default function SharingScreen({navigation}) {
  const {mFunc, setMFunc} = useContext(FxContext);
  const [isMonitoring, setIsMonitoring] = useState(true);
  useEffect(() => {
    mFunc
      .startMonitoring()
      .then(() => {
        console.log('monitoring started');
        ToastModule.showToast('Contact Tracing is initiated.');
        setIsMonitoring(true);
      })
      .catch(() => {
        ToastModule.showToast(
          'Can`t start Contact Tracing. Please restart the app.',
        );
        mFunc.stopMonitoring().catch(() => {
          console.log('error starting and stopping monitoring');
        });
      });
  }, []);

  return (
    <>
      <React.Fragment>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <ScrollView style={{backgroundColor: '#FFFFFF'}}>
          <WingBlank size="lg">
            <Flex direction="column" align="center" style={{marginTop: '10%'}}>
              <Header width={'100%'} />
              <WhiteSpace size="sm" />
              <Text style={styles.headerText}>We want you to be informed.</Text>
              <WingBlank size="lg">
                <Text style={styles.desc}>
                  Let this app run in the background.
                </Text>
                <Text style={styles.desc}>
                  Whenever we confirmed that someone you have encountered has
                  been tested positive for COVID-19, we will give you a
                  notification.
                </Text>
              </WingBlank>
              <WhiteSpace size="lg" />
              <Text style={styles.desc}>You may also share through:</Text>
              <WhiteSpace size="sm" />
              <Text
                style={{
                  color: '#0888E2',
                  fontSize: 20,
                  textAlign: 'center',
                  lineHeight: 22,
                }}
                onPress={() => Linking.openURL('https://endcov.ph/')}>
                https://endcov.ph/
              </Text>
              <WhiteSpace size="lg" />
              <WhiteSpace size="sm" />
              <Button
                onPress={() => {
                  copyToClipboard();
                }}
                style={{
                  borderRadius: 30,
                  width: '90%',
                  backgroundColor: '#D63348',
                }}
                type="warning">
                Copy Link to Share
              </Button>
              <WhiteSpace size="lg" />
              <Text style={styles.desc}>
                or you can let your friends or family
              </Text>
              <Text style={styles.desc}>scan the QR code below</Text>
              <Image
                source={qrImg}
                style={{
                  width: 250,
                  height: 250,
                  marginTop: 20,
                }}
              />
              <WhiteSpace size="lg" />
              <WhiteSpace size="lg" />
              {isMonitoring ? (
                <Button
                  activeStyle={false}
                  onPress={() => {
                    mFunc.stopMonitoring().then(() => {
                      setIsMonitoring(false);
                      ToastModule.showToast(
                        'Monitoring stopped. Enable to allow contact tracing.',
                      );
                    });
                  }}>
                  Disable Contact Tracing
                </Button>
              ) : (
                <Button
                  activeStyle={false}
                  onPress={() => {
                    mFunc
                      .startMonitoring()
                      .then(() => {
                        console.log('monitoring started');
                        ToastModule.showToast('Contact Tracing is initiated.');
                        setIsMonitoring(true);
                      })
                      .catch(() => {
                        ToastModule.showToast(
                          'Can`t start Contact Tracing. Please restart the app.',
                        );
                        mFunc.stopMonitoring().catch(() => {
                          console.log('error starting and stopping monitoring');
                        });
                      });
                  }}>
                  Enable Contact Tracing
                </Button>
              )}
              <WhiteSpace size="lg" />
              <WhiteSpace size="lg" />
            </Flex>
          </WingBlank>
        </ScrollView>
      </React.Fragment>
    </>
  );
}

const styles = StyleSheet.create({
  defaultFontSize: {
    fontSize: 24,
  },
  headerText: {
    textAlign: 'center',
    width: '100%',
    fontSize: 20,
    marginTop: 23,
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#666666',
  },
  desc: {
    textAlign: 'center',
    fontWeight: '100',
    fontWeight: '100',
    fontSize: 17,
    lineHeight: 40,
    color: '#808689',
    //backgroundColor: '#808689',
  },
  baseText: {
    fontFamily: 'Roboto',
  },
});
