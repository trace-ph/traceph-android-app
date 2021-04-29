import React, { useContext } from 'react';
import {
  StatusBar,
  Text,
  ScrollView,
  Image,
  Linking,
  Clipboard,
  NativeModules,
} from 'react-native';
import styles from './Styles';

const {ToastModule} = NativeModules;

import {Button, Flex, WhiteSpace, WingBlank} from '@ant-design/react-native';

import FxContext from '../FxContext';

import Header from '../assets/header.svg';
const qrImg = require('../assets/qr.png');

const copyToClipboard = () => {
  Clipboard.setString('https://endcov.ph/');
  ToastModule.showToast('Copied to Clipboard');
};

export default function aboutUsScreen({navigation}) {
  const {mFunc, setMFunc} = useContext(FxContext);

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
                  Whenever we confirmed that someone you have encountered has
                  been tested positive for COVID-19, we will give you a
                  notification.
                </Text>
              </WingBlank>
              <WhiteSpace size="lg" />
              <Text style={styles.desc}>You may also share through:</Text>
              <WhiteSpace size="sm" />
              <Text
                style={styles.link}
                onPress={() => Linking.openURL('https://endcov.ph/')}>
                https://endcov.ph/
              </Text>
              <WhiteSpace size="lg" />
              <WhiteSpace size="sm" />
              <Button
                onPress={() => {
                  copyToClipboard();
                }}
                style={styles.redButton}
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
            </Flex>
          </WingBlank>
        </ScrollView>
      </React.Fragment>
    </>
  );
}
