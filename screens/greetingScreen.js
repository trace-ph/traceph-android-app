import React from 'react';
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

import Header from '../assets/potterHeader.svg';

const B = props => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;

export default function GreetingScreen({navigation}) {
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
                TracePH would like to ask for your consent in sending
                information of encounters with you if they have been confirmed
                positive or PUI (Person Under Investigation) of COVID-19.
              </Text>
              <WhiteSpace size="lg" />
              <WhiteSpace size="sm" />
              <Text style={styles.desc}>
                To do this, we will need your help to turn on your
                <B> device bluetooth.</B>
              </Text>
              <WhiteSpace size="lg" />
              <Text style={styles.desc}>
                TracePH exchanges Bluetooth signals with nearby mobile phones
                which runs the same app.
              </Text>
              <WhiteSpace size="lg" />
              <WhiteSpace size="sm" />
              <Button
                onPress={() => {
                  navigation.navigate('askForBluetooth');
                }}
                style={{
                  borderRadius: 30,
                  width: '90%',
                  backgroundColor: '#D63348',
                }}
                type="warning">
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
    fontSize: 34,
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#666666',
  },
  desc: {
    textAlign: 'left',
    fontWeight: '100',
    fontWeight: '100',
    fontSize: 17,
    lineHeight: 45,
    color: '#808689',
    //backgroundColor: '#808689',
  },
});
