import React, {useContext, useState} from 'react';
import {
  Text,
  NativeModules,
  View,
  SafeAreaView,
	Alert,
} from 'react-native';
import styles from './Styles';

const {ToastModule} = NativeModules;

import FxContext from '../FxContext';

import {Button, Flex, WhiteSpace, WingBlank} from '@ant-design/react-native';

// For OTP input fields
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from
'react-native-confirmation-code-field';

// For sending info via HTTP
import Axios from 'axios';
import { API_URL } from '../configs';


// Checks the input token
// Returns verdict message
async function tokenCheck(data, input, node_id, patient_info){
  const reportURL = API_URL + '/report';
  let verdict = await Axios.post(reportURL,{
    node_id: node_id,
    patient_info: patient_info,
    data: data,
    token: input,
  })
  // .then((res) => console.log(res))
  .catch((err) => console.error(err));

  return verdict.data;
}


export default function inputToken( {route, navigation} ) {
  // Get the parameters and context
  const { data, token } = route.params;
	const { test_result, test_result_date, reference_date } = route.params;
  const { mFunc, setMFunc } = useContext(FxContext);
  const patient_info = {
    test_result: test_result,
    test_result_date: test_result_date,
    reference_date: reference_date,
  };

  // Code field parameters
  const CELL_COUNT = 6;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

	// Show authorization code as an alert message
	const [showAlert, setShowAlert] = useState(true);
	if(showAlert)
		Alert.alert(
			'Authorization code',
			JSON.stringify(token),
			[{ text: 'OK', onPress: () => setShowAlert(false)}],
			{ cancelable: false }
		);

  return (
    <SafeAreaView style={styles.root}>
      <Text style={styles.headerText}>
        Input authentication code
      </Text>

      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <View
            // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[styles.cellRoot, isFocused && styles.focusCell]}>
            <Text style={styles.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />

      <WhiteSpace size="lg" />
      <Button
        onPress={async () => {
          // Check if input field is not full
          if(value.length != 6){
            ToastModule.showToast('Incomplete code');
            return;
          }

          // Get verdict
          let verdict = await tokenCheck(data, value, mFunc.nodeIdRef.current, patient_info);
          // ToastModule.showToast(verdict);

          navigation.replace('reportVerdict', { result: verdict });
        }}
        style={styles.redButton}
      >
        Submit
      </Button>
    </SafeAreaView>
  );
}

/*
Code Reference:
> OTP template
  https://stackoverflow.com/questions/47506829/how-to-design-react-native-otp-enter-screen
  https://www.npmjs.com/package/react-native-confirmation-code-field
*/
