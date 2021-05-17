import React, {useContext, useState} from 'react';
import {
  Text,
  View,
} from 'react-native';
import styles from './Styles';

// const {ToastModule} = NativeModules;

import {Button, Flex, WhiteSpace, WingBlank} from '@ant-design/react-native';
const B = props => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;

import Header from '../assets/header.svg';

export default function startReport( {navigation} ) {

  return (
    <View style={styles.defaultView}>
      <WingBlank size="lg">
				<WhiteSpace size="xl" />
				<WhiteSpace size="xl" />
        <Header width={'100%'} />
				<WhiteSpace size="xl" />
        <Text style={styles.headerText}>
          Implications of reporting
        </Text>
        <Text style={styles.desc}>
          To make a report, point the camera to the DetectPH QR code found in your lab test result. You can only report once per day.
          {"\n\n"}
          <B>Remember:</B> You're only reporting for yourself and <B>not</B> on behalf of others.
        </Text>
        <WhiteSpace size="xl" />

        <Button
        onPress={() => {
          navigation.navigate('inputResults');
        }}
        type="warning"
        style={styles.redButton}
        >
        I understand!
        </Button>
      </WingBlank>
    </View>
  );
}
