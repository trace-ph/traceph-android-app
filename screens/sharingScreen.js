import React from 'react';
import {
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text,
  ScrollView,
  Image,
  Linking,
  Dimensions,
} from 'react-native';

import {Button, Flex, WhiteSpace, WingBlank} from '@ant-design/react-native';

import Header from '../assets/header.svg';
const qrImg = require('../assets/qr.png');

export default function SharingScreen({navigation}) {
  return (
    <>
      <React.Fragment>
        <StatusBar barStyle="light-content" />
        <ScrollView>
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
                  width: Dimensions.get('window').width * 0.9,
                  height: Dimensions.get('window').width * 0.9,
                  marginTop: 20,
                }}
              />
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
