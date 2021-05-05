import React, {useContext, useState} from 'react';
import {
  Text,
  View,
} from 'react-native';
import styles from './Styles';

// const {ToastModule} = NativeModules;

import {Button, Flex, WhiteSpace, WingBlank} from '@ant-design/react-native';
const B = props => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;


export default function startReport( {navigation} ) {

  return (
    <View style={{flex:1}}>
    <Text style={styles.headerText}>
      Implications of reporting
    </Text>
    <Text style={styles.desc}>
        <B>Remember:</B> You're only reporting for yourself and <B>not</B> on behalf of others. Reporting on behalf of others does not help.
    </Text>
    <WhiteSpace size="lg" />

    <Button
    onPress={() => {
      navigation.navigate('inputResults');
    }}
    style={styles.redButton}
    >
    Report
    </Button>

    </View>
  );
}
