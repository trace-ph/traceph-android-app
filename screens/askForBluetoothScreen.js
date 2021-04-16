import React, {useContext} from 'react';
import {
  StyleSheet,
  StatusBar,
  Text,
  ScrollView,
  Image,
  Linking,
  NativeModules,
} from 'react-native';

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
                Please turn on your bluetooth from your settings to start using
                detectPH app.
              </Text>
              <WhiteSpace size="lg" />
              <WhiteSpace size="lg" />
              <WhiteSpace size="lg" />
              <WhiteSpace size="lg" />
              <WhiteSpace size="lg" />
              <WhiteSpace size="lg" />
              <WhiteSpace size="lg" />
              <WhiteSpace size="lg" />
              <Button
                onPress={() => {
                  mFunc
                    .enableBluetooth()
                    .then(() => {
                      navigation.replace('Drawer');
                    })
                    .catch(err => console.log('err', err));
                }}
                style={{
                  borderRadius: 30,
                  width: '90%',
                  backgroundColor: '#D63348',
                }}
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

const styles = StyleSheet.create({
  defaultFontSize: {
    fontSize: 24,
  },
  baseText: {
    fontFamily: 'Roboto',
  },
  headerText: {
    textAlign: 'left',
    width: '100%',
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#666666',
  },
  desc: {
    textAlign: 'center',
    fontWeight: '100',
    fontWeight: '100',
    fontSize: 17,
    lineHeight: 38,
    color: '#808689',
    //backgroundColor: '#808689',
  },
});
