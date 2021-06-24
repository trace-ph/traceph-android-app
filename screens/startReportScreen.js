import React, {useContext, useState} from 'react';
import {
  Text,
  Image,
  View,
} from 'react-native';
import styles from './Styles';

import {Button, Flex, WhiteSpace, WingBlank} from '@ant-design/react-native';
const B = props => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;

const Header = require('../assets/report.png');

export default function startReport( {navigation} ) {

  return (
    <View style={styles.defaultView}>
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
            To make a report, point the camera to the DetectPH QR code found in your lab test result. You can only report once per day.
            {"\n\n"}
            <B>Remember:</B> You're only reporting for yourself and <B>not</B> on behalf of others.
          </Text>
          <WhiteSpace size="xl" />
        </WingBlank>

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
