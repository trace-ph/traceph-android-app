import React, {useContext, useState} from 'react';
import {
  StatusBar,
  Text,
	Linking,
  ScrollView,
  NativeModules,
} from 'react-native';
import Checkbox from '@react-native-community/checkbox';

import {Button, Flex, WhiteSpace, WingBlank} from '@ant-design/react-native';

import FxContext from '../FxContext';
const {ToastModule} = NativeModules;

import Header from '../assets/potterHeader.svg';
import styles from './Styles';

const B = props => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;
const P = props => <Text style={styles.link} onPress={() => Linking.openURL("https://github.com/trace-ph/traceph-android-app#detectph-android-app")}>{props.children}</Text>;

export default function GreetingScreen({navigation}) {
  const {mFunc, setMFunc} = useContext(FxContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  return (
    <>
      <React.Fragment>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <ScrollView style={{backgroundColor: '#FFFFFF'}}>
          <WingBlank size="lg" style={{paddingHorizontal: '5%'}}>
            <Flex direction="column" align="center" style={{marginTop: '10%'}}>
              <Text style={styles.headerText}>Hello!</Text>
              <Header width={'100%'} />
              <WhiteSpace size="lg" />
              <Text style={styles.desc}>
                DetectPH would like to ask for your consent in sending information of encounters with you if they have been confirmed positive of COVID-19.
              </Text>
              <WhiteSpace size="xl" />

              <Text style={styles.desc}>
                To do this, we will need your help by turning on your <B>device bluetooth and location</B> and <B>disabling your battery optimizations</B> for this app. DetectPH exchanges Bluetooth signals with nearby mobile phones which runs the same app. These signal will serve as records of your contacts. The records are made as long as the app is open, even in the background. You may opt-out from being traced by disabling contact-tracing. We DO NOT access your location. We're only using the location access to ensure Bluetooth is working.
              </Text>
              <WhiteSpace size="xl" />

              <Text style={styles.desc}>
                You may also report in-app of your lab test results by scanning our QR code found in your results. By reporting to us, we will notify your close contacts for you. We don't keep records of your reports.
              </Text>
              <WhiteSpace size="xl" />

              <Text style={styles.desc}>
                Do turn on your <B>internet or mobile data</B> every few hours to receive notifications and send your records.
              </Text>
              <WhiteSpace size="xl" />
              
              <Text style={styles.desc}>
                Let's help each other in these times. Early detection, better protection.
              </Text>
              <WhiteSpace size="sm" />

              <Text style={styles.cardDesc}>                
              <Checkbox
                value={isAccepted}
                onChange={() => setIsAccepted(!isAccepted)}
              />
              I have read and accept the <P>privacy policy</P> of this app. 
              </Text>
              <WhiteSpace size="xl" />

              <Button
                onPress={() => {
                  if(!isAccepted){
                    ToastModule.showToast("You have to accept the privacy policy.")
                    return;
                  }

                  setIsLoading(true);
                  mFunc.getNodeId()
                    .then(() => {
                      setIsLoading(false);
                      mFunc.enableBluetooth()
                        .then(() => navigation.replace('Drawer'))
                        .catch(err => {
                          console.log('err', err);
                          navigation.replace('askForBluetooth');
                        });
                    })
                    .catch(() => setIsLoading(false));
                }}
                style={styles.redButton}
                type="warning"
                loading={isLoading}
                disabled={isLoading}>
                I Agree on this
              </Button>
              <WhiteSpace size="lg" />
              <WhiteSpace size="lg" />
            </Flex>
          </WingBlank>
        </ScrollView>
      </React.Fragment>
    </>
  );
}
