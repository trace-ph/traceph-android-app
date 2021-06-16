import React, {useContext, useState} from 'react';
import {
  StatusBar,
  Text,
  ScrollView,
} from 'react-native';

import {Button, Flex, WhiteSpace, WingBlank} from '@ant-design/react-native';

import FxContext from '../FxContext';

import Header from '../assets/potterHeader.svg';
import styles from './Styles';

const B = props => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;

export default function GreetingScreen({navigation}) {
  const {mFunc, setMFunc} = useContext(FxContext);
  const [isLoading, setIsLoading] = useState(false);
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
              <WhiteSpace size="lg" />
              <WhiteSpace size="sm" />

              <Text style={styles.desc}>
                To do this, we will need your help to turn on your <B>device bluetooth and location.</B>
              </Text>
              <WhiteSpace size="lg" />

              <Text style={styles.desc}>
                DetectPH exchanges Bluetooth signals with nearby mobile phones which runs the same app. 
              </Text>
              <WhiteSpace size="lg" />
              <WhiteSpace size="sm" />
              <Button
                onPress={() => {
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
