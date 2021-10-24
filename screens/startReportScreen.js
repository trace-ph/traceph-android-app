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
            By making a report means that you <B>CONSENT</B> in giving DetectPH the following information (dates of testing, dates when results were received, COVID-19 test result) in order for us to notify your probable close contacts, and that all information you put is <B>TRUE</B>.{"\n"}
            By scanning a DetectPH QR code, you ensure that the QR code came from your own test results and not from others. Scanning QR codes that are not your own will prevent the owner from validating their own report. These QR codes <B>DO NOT</B> include any identifiable data and serve only as an authentication. They will expire after 1 week unused or after you successfully used them to report.{"\n"}
            You can only report successfully once per day.
            {"\n\n"}
            <B>Remember:</B> All information is voluntarily given by you. You're only reporting for yourself and <B>not</B> on behalf of others.
          </Text>
          <WhiteSpace size="xl" />
          <Text style={styles.desc}>
            <B>Instructions:{"\n"}</B>
            1) Please make sure that you have internet connection before making a report.{"\n"}
            2) Allow camera permissions. The camera will only be used to scan QR codes.{"\n"}
            3) Input the information being asked. These should be found in your lab test result.{"\n"}
            4) Double check and confirm the results you've inputted.{"\n"}
            5) Point the camera to a <B>DetectPH QR code</B> found in your lab test result. The camera will scan the QR code.{"\n"}
            6) Authenticate your report by inputting the OTP code you'll receive after scanning.{"\n"}
            7) Wait for your report verdict. If the report is successful, we will use the info you've given to find your close contacts and notify them.
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
        I consent!
        </Button>
        <WhiteSpace size="lg" />
        <WhiteSpace size="lg" />
      </WingBlank>
    </ScrollView>
  );
}
