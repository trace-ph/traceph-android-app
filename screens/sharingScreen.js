import React, {useEffect, useContext, useState} from 'react';
import {
  StatusBar,
  Text,
  ScrollView,
  NativeModules,
} from 'react-native';
import styles from './Styles';

const {ToastModule} = NativeModules;

import {Button, Flex, WhiteSpace, WingBlank, Switch, List} from '@ant-design/react-native';

import FxContext from '../FxContext';

import Header from '../assets/header.svg';

export default function SharingScreen({navigation}) {
  const {mFunc, setMFunc} = useContext(FxContext);
  const [isMonitoring, setIsMonitoring] = useState(true);

  useEffect(() => {
    mFunc
      .startMonitoring()
      .then(() => {
        console.log('monitoring started');
        ToastModule.showToast('Contact Tracing is initiated.');
        setIsMonitoring(true);
      })
      .catch(() => {
        ToastModule.showToast(
          'Can`t start Contact Tracing. Please restart the app.',
        );
        mFunc.stopMonitoring().catch(() => {
          console.log('error starting and stopping monitoring');
        });
      });

    return function cleanMonitoring() {
      mFunc.stopMonitoring();
    }
  }, []);

  return (
    <>
      <React.Fragment>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <ScrollView style={{backgroundColor: '#FFFFFF'}}>
          <WingBlank size="lg" style={{paddingHorizontal: '5%'}}>
            <Flex direction="column" align="center" style={{marginTop: '10%'}}>
              <Header width={'100%'} />
              <WhiteSpace size="sm" />
              <List>
                <List.Item
                  extra={<Switch
                    checked={isMonitoring}
                    onChange={(checked) => {
                      setIsMonitoring(!isMonitoring);
                      
                      if(checked){
                        mFunc
                        .startMonitoring()
                        .then(() => {
                          console.log('monitoring started');
                          ToastModule.showToast('Contact Tracing is initiated.');
                        })
                        .catch(() => {
                          ToastModule.showToast(
                            'Can`t start Contact Tracing. Please restart the app.',
                          );
                          mFunc.stopMonitoring().catch(() => {
                            console.log('error starting and stopping monitoring');
                          });
                        });

                      } else {
                        mFunc.stopMonitoring().then(() => {
                          ToastModule.showToast(
                            'Monitoring stopped. Enable to allow contact tracing.',
                          );
                        });
                      }
                    }}
                  />}
                >
                  Contact-tracing
                </List.Item>
                <WhiteSpace size="xl" />

                <WingBlank size="lg">
                  <Text style={[styles.desc, { textAlign: 'center' }]}>
                    We want you to be informed. {'\n'}
                    Let this app run in the background.
                  </Text>
                  <Text style={styles.desc}>
                    Whenever we confirmed that someone you have encountered has been tested positive for COVID-19, we will give you a notification.
                  </Text>
                  <WhiteSpace size="lg" />
                  <WhiteSpace size="lg" />
                </WingBlank>
              </List>
            </Flex>
          </WingBlank>
        </ScrollView>
      </React.Fragment>
    </>
  );
}
