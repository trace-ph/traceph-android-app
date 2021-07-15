import React, {useContext} from 'react';
import {
  Text,
  Image,
  ScrollView,
  NativeModules,
} from 'react-native';
import styles from './Styles';

import FxContext from '../FxContext';
const {ToastModule} = NativeModules;

import {Button, Flex, WhiteSpace, WingBlank} from '@ant-design/react-native';
const B = props => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;

const Header = require('../assets/report.png');

export default function startReport({ navigation }) {
  const {mFunc, setMFunc} = useContext(FxContext);

  return (
    <ScrollView style={styles.defaultView}>
      <WhiteSpace size="xl" />
      <Image
        source={Header}
        resizeMode="contain"
        style={{
          width: '100%',
          height: undefined,
          aspectRatio: 2,
        }}
      />
      <WingBlank size="lg" style={{paddingHorizontal: '5%'}}>
        <Text style={styles.headerText}>
          Implications of reporting
        </Text>
        <WingBlank size="lg">
          <Text style={styles.desc}>
            To make a report, point the camera to the DetectPH QR code found in your lab test result. The camera will scan the QR code and get a code for you to input. Once your report is authenticated, we will use the info you filled up to find your close contacts and notify them. You can only report successfully once per day.
            {"\n\n"}
            <B>Remember:</B> You're only reporting for yourself and <B>not</B> on behalf of others.
          </Text>
          <WhiteSpace size="xl" />
        </WingBlank>

        <Button
        onPress={() => {
          mFunc.enableCamera()
          .then(() => navigation.navigate('inputResults'))
          .catch((err) => {
            console.log("Camera err: ", err);
            ToastModule.showToast("Camera is not permitted");
          });
        }}
        type="warning"
        style={styles.redButton}
        >
        I understand!
        </Button>
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
      </WingBlank>
    </ScrollView>
  );
}
