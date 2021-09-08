import React, {useContext, useState} from 'react';
import {
  Text,
  View,
  Modal,
  NativeModules,
} from 'react-native'; 
import styles from './Styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import Checkbox from '@react-native-community/checkbox';
import moment from 'moment';

const {ToastModule} = NativeModules;

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
            extra={moment(testDate).format("MMMM D, YYYY")}
            onClick={() => setPickTestDate(true)}
            wrap
          />

          <Text style={styles.desc}>When did you received your lab results?</Text>
          <List.Item 
            extra={moment(resultDate).format("MMMM D, YYYY")}
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
          maximumDate={pickTestDate ? resultDate : new Date()}    // Test date should not go beyond result date
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
          onPress={() => {
            if(testDate > resultDate){
              ToastModule.showToast("Test date should be before your result date");
              return;
            }
            setShowPopUp(true)
          }}
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
          <Text style={styles.desc}><B>Testing date:</B> {moment(testDate).format("MMMM D, YYYY")}</Text>
          <Text style={styles.desc}><B>Received result date:</B> {moment(resultDate).format("MMMM D, YYYY")}</Text>
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
                test_result_date: moment(resultDate).format("YYYY-MM-DD"),
                reference_date: moment(testDate).format("YYYY-MM-DD"),
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