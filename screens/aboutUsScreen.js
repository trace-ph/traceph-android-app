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
const B = props => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;
const L = props => <Text style={styles.link} onPress={() => Linking.openURL(props.children)}>{props.children}</Text>;
const C = props => <Text style={styles.copy} onPress={() => { Clipboard.setString(props.children); ToastModule.showToast("Copied " + props.children);}}>{props.children}</Text>;
const P = props => <Text style={styles.link} onPress={() => Linking.openURL("https://detectph.com/privacy.html")}>{props.children}</Text>;

const DPH_icon = require('../assets/DetectPH_transparent.png');

export default function aboutUsScreen({navigation}) {
  return (
    <>
      <React.Fragment>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <ScrollView style={{backgroundColor: '#FFFFFF'}}>
          <WingBlank size="lg" style={{paddingHorizontal: '5%'}}>
            <Flex direction="column" align="center" style={{marginTop: '10%'}}>
              <Image
                source={DPH_icon}
                style={{
                  width: 100,
                  height: 100,
                }}
              />
              <WhiteSpace size="sm" />
              <Text style={styles.headerText}>DetectPH</Text>
              <WingBlank size="lg">
                <Text style={styles.desc}>
                <B>Early Detection, Better Protection</B>{"\n"}
                DetectPH is a mobile app that automates the contact-tracing process. Our goal is to inform people of their exposure as quickly as possible. Using your phone's Bluetooth, it keeps records of DetectPH users near you. Whenever you're connected to the internet, these records will be uploaded to our database as your possible contacts.
                </Text>
                <WhiteSpace size="lg" />

                <Text style={styles.desc}>
                <B>Received a positive COVID result?</B> Report it in-app and we'll notify those we determined as your close contacts for you. We'll keep your identity a secret; Your close contacts will only know they're exposed.
                </Text>
                <WhiteSpace size="lg" />
                
                <Text style={styles.desc}>
                If you have any concerns about the app or our <P>privacy policy</P>, please email us through <C>detectph.updsc@gmail.com</C> with the subject <B>"DetectPH Concern"</B>.
                </Text>
                <WhiteSpace size="xl" />
                <WhiteSpace size="xl" />
              </WingBlank>
            </Flex>
          </WingBlank>
        </ScrollView>
      </React.Fragment>
    </>
  );
}
