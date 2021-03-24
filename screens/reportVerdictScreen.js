import React, {useContext, useState} from 'react';
import {
  StyleSheet,
  StatusBar,
  Text,
  ScrollView,
  Image,
  Linking,
  NativeModules,
  View,
} from 'react-native';

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
      onPress={() => navigation.pop()}    // Pop current screen from stack
      style={{
        borderRadius: 30,
        width: '90%',
        backgroundColor: '#D63348',
        alignSelf: 'center',
      }}
      > 
      Ok
      </Button>
      
    </View>
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
