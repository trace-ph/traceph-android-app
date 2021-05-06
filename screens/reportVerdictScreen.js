import React, {useContext, useState} from 'react';
import {
  Text,
  View,
} from 'react-native';
import styles from './Styles';

// const {ToastModule} = NativeModules;

import {Button, Flex, WhiteSpace, WingBlank} from '@ant-design/react-native';


// Shows verdict of the report
export default function reportVerdict( {route, navigation} ) {
  // Get the parameters
  const { result } = route.params;
  let verdict = '';

  // Verdict text
  if(result == 'scan')
    verdict = 'Sorry but your report could not be made. It\'s possible that you may have reported before or your QR code is broken.';
  else if(result == 'expired')
    verdict = 'Sorry but your report could not be made. Your QR code is expired';
  else if(result == 'denied')
    verdict = 'Sorry but your report could not be made. This QR code has already been reported';
  else if(result == 'accepted')
    verdict = 'Report accepted';
  else 
    verdict = 'Wrong input code';


  return (
    <View style={{flex:1}}>
      <Text style={styles.headerText}>
        Report verdict:
      </Text>
      <Text style={styles.desc}>
        {verdict}
      </Text>

      <Button
      onPress={() => navigation.popToTop()}    // Pop to the startReport screen from stack
      style={styles.redButton}
      > 
      Ok
      </Button>
      
    </View>
  );
}
