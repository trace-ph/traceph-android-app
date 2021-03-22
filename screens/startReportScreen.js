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
const B = props => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;

//
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
        navigation.navigate('QRscanner');
    }}
    style={{
        borderRadius: 30,
        width: '90%',
        backgroundColor: '#D63348',
        alignSelf: 'center',
    }}
    > 
    Report
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
