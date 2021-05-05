import React, {useContext, useState} from 'react';
import {
  Text,
  View,
} from 'react-native'; 
import styles from './Styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import Checkbox from '@react-native-community/checkbox';

import {Button, Flex, WhiteSpace, WingBlank, List} from '@ant-design/react-native';
const B = props => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;


// Input the required details
export default function inputResults( {route, navigation} ) {
  const [testDate, setTestDate] = useState(new Date());
  const [resultDate, setResultDate] = useState(new Date());
  const [covidResult, setCovidResult] = useState(false);
  const [pickTestDate, setPickTestDate] = useState(false);
  const [pickResultDate, setPickResultDate] = useState(false);

  return (
    <View style={{flex:1}}>  
      <List>
          <List.Item 
            extra={formatDate(testDate)}
            onClick={() => setPickTestDate(true)}
            wrap
          >
            When did you get tested?
          </List.Item>
          <List.Item 
            extra={formatDate(resultDate)}
            onClick={() => setPickResultDate(true)}
            wrap
          >
            When did you received your lab results?
          </List.Item>
          <List.Item>
            <Checkbox
              value={covidResult}
              onChange={() => setCovidResult(!covidResult)}
            />
            Are you COVID-positive?
          </List.Item>
      </List>

      {(pickTestDate || pickResultDate) && <DateTimePicker 
        value={pickTestDate ? testDate : resultDate}
        mode='date'
        display='calendar'
        maximumDate={new Date()}
        onChange={(event, date) => {
          if(event.type == 'dismissed')
            return;

          if(pickTestDate){
            setTestDate(date);
            setPickTestDate(false);
          } else {
            setResultDate(date);
            setPickResultDate(false);
          }
        }}
      />}

      <WhiteSpace size="xl" />
      <Button
      onPress={() => navigation.navigate('confirmResults', {
          test_result: covidResult,
          test_result_date: formatDate(resultDate),
          reference_date: formatDate(testDate),
      })}
      style={styles.redButton}
      > 
      Submit
      </Button>
    </View>
  );
}


function formatDate(createdDate){
	let m = createdDate.getMonth();
	let d = createdDate.getDate();
	let y = createdDate.getFullYear();
  if(m < 10 && d < 10)
    return date = y + '-0' + m + '-0' + d;
  else if(m < 10)
    return date = y + '-0' + m + '-' + d;
  else if(d < 10)
    return date = y + '-' + m + '-0' + d;
  else
    return date = y + '-' + m + '-' + d;
}

/*
Code References:
> Datepicker
  https://www.npmjs.com/package/react-datetime
*/