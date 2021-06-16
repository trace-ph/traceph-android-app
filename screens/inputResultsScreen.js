import React, {useContext, useState} from 'react';
import {
  Text,
  View,
  Modal,
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
	const [showPopUp, setShowPopUp] = useState(false);

  return (
    <View style={styles.defaultView}>  
      <WingBlank size="lg" style={{paddingHorizontal: '5%'}}>
        <WhiteSpace size="xl" />
        <Text style={styles.headerText}>Lab test results</Text>
        <Text style={styles.desc}><B>Input the needed information.</B></Text>
        <WhiteSpace size="xl" />

        <List>
          <Text style={styles.desc}>When did you get tested?</Text>
          <List.Item 
            extra={formatDate(testDate)}
            onClick={() => setPickTestDate(true)}
            wrap
          />

          <Text style={styles.desc}>When did you received your lab results?</Text>
          <List.Item 
            extra={formatDate(resultDate)}
            onClick={() => setPickResultDate(true)}
            wrap
          />

          <Text style={styles.desc}>Are you COVID-positive?</Text>
          <List.Item>
            <Checkbox
              value={covidResult}
              onChange={() => setCovidResult(!covidResult)}
            />
          </List.Item>
        </List>

        {(pickTestDate || pickResultDate) && <DateTimePicker 
          value={pickTestDate ? testDate : resultDate}
          mode='date'
          display='calendar'
          maximumDate={new Date()}
          onChange={(event, date) => {
            setPickResultDate(false);
            setPickTestDate(false);

            if(event.type == 'dismissed')
              return;

            if(pickTestDate)
              setTestDate(date);
            else
              setResultDate(date);
          }}
        />}

        <WhiteSpace size="xl" />
        <Button
          onPress={() => setShowPopUp(true)}
          style={styles.redButton}
          type="warning"
        > 
        Submit
        </Button>
      </WingBlank>

      {/* Pop-up code */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showPopUp}
        onRequestClose={() => console.log('Confirmation is closed')}
      >
        <View style={[styles.container, styles.dimBG]}>
          <View style={styles.popUp}>
          <Text style={styles.headerText}>Are these correct?</Text>
          <Text style={styles.desc}><B>Testing date:</B> {formatDate(testDate)}</Text>
          <Text style={styles.desc}><B>Received result date:</B> {formatDate(resultDate)}</Text>
          <Text style={styles.desc}><B>COVID result:</B> {covidResult ? 'Positive' : 'Negative'}</Text>
          <WhiteSpace size="sm" />
          <Button
            onPress={() => setShowPopUp(false)}
            style={styles.whiteButton}
          >
            Go back
          </Button>
          <Button
            onPress={() => {
              setShowPopUp(false);
              navigation.navigate('QRscanner', {
                test_result: covidResult,
                test_result_date: formatDate(resultDate),
                reference_date: formatDate(testDate),
              });
            }}
            style={styles.redButton}
            type="warning"
          >
            Confirm
          </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}


function formatDate(createdDate){
	let m = createdDate.getMonth() + 1;
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
