import React, {useContext, useState} from 'react';
import {
  Text,
  View,
} from 'react-native'; 
import styles from './Styles';

import {Button, Flex, WhiteSpace, WingBlank, List} from '@ant-design/react-native';
const B = props => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;


// Input the required details
export default function inputResults( {route, navigation} ) {
	const { test_result, test_result_date, reference_date } = route.params;

  return (
    <View style={{flex:1}}>  
      <List>
          <List.Item 
            extra={reference_date}
          >
            Test date
          </List.Item>
          <List.Item 
            extra={test_result_date}
          >
            Received result date
          </List.Item>
          <List.Item 
            extra={test_result ? 'Positive' : 'Negative'}
          >
            Covid result
          </List.Item>
      </List>

      <WhiteSpace size="lg" />
      <Button
      onPress={() => navigation.navigate('QRscanner', {
				test_result: test_result,
				test_result_date: test_result_date,
				reference_date: reference_date,
      })}
      style={styles.redButton}
      > 
      Confirm
      </Button>
    </View>
  );
}

/*
Code References:
> Datepicker
  https://www.npmjs.com/package/react-datetime
*/