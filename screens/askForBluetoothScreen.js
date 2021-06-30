import React, {useContext} from 'react';
import {
  StatusBar,
  Text,
  ScrollView,
  Image,
  NativeModules,
} from 'react-native';
import styles from './Styles';

const {ToastModule} = NativeModules;

import {Button, Flex, WhiteSpace, WingBlank} from '@ant-design/react-native';

import FxContext from '../FxContext';

const bleImg = require('../assets/bleHeader.png');

const B = props => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;

export default function AskBluScreen({navigation}) {
  const {mFunc, setMFunc} = useContext(FxContext);

  return (
    <>
      <React.Fragment>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <ScrollView style={{backgroundColor: '#FFFFFF'}}>
          <WingBlank size="lg" style={{paddingHorizontal: '5%'}}>
            <Flex direction="column" align="center" style={{marginTop: '15%'}}>
              <Image
                source={bleImg}
                resizeMode="contain"
                style={{
                  width: 300,
                  height: 180,
                  marginTop: 20,
                }}
              />
              <WhiteSpace size="lg" />
              <Text style={styles.headerText}>
                We noticed that your bluetooth is off
              </Text>
              <WhiteSpace size="lg" />
              <Text style={styles.desc}>
                Please turn on your bluetooth and location from your settings to start using DetectPH app. Make sure to set the permissions to <B>Allow all the time</B> option.
              </Text>
              <WhiteSpace size="xl" />
              <WhiteSpace size="xl" />
              <WhiteSpace size="xl" />
              <WhiteSpace size="xl" />
              <Button
                onPress={() => {
                  mFunc
                    .enableBluetooth()
                    .then(() => {
                      navigation.replace('Drawer');
                    })
                    .catch((err) => {
                      console.log('err', err);
                      if(err == 'never_ask_again' || err == 'denied')
                        ToastModule.showToast('Location access is denied');
                    });
                }}
                style={styles.redButton}
                type="warning">
                Okay! Got it.
              </Button>
            </Flex>
          </WingBlank>
        </ScrollView>
      </React.Fragment>
    </>
  );
}
