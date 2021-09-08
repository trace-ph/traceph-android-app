import React, {useContext, useState} from 'react';
import {
  Text,
  NativeModules,
  View,
  SafeAreaView,
  Modal,
} from 'react-native';
import styles from './Styles';
const B = props => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>;

const {ToastModule} = NativeModules;

import FxContext from '../FxContext';
import BackgroundTimer from 'react-native-background-timer';

import {Button, Flex, WhiteSpace, WingBlank} from '@ant-design/react-native';

// For OTP input fields
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from
'react-native-confirmation-code-field';

import { sendReport } from '../apis/report';


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

	// Pop-up code
	const [counter, setCounter] = useState(30);
	const [showPopUp, setShowPopUp] = useState(true);

	// Updates every 1 second and stops when counter == 0
	if(showPopUp){
		BackgroundTimer.setTimeout(function countDown(){
			setCounter(counter - 1);
			console.log(counter - 1);

			if(counter - 1 <= 0)
				setShowPopUp(false);

		}, 1000);
	}

  return (
    <SafeAreaView style={styles.defaultView}>
      <WingBlank size="lg">
        <WhiteSpace size="xl" />
        <Text style={styles.desc}>
          Input your received code here
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

        <WhiteSpace size="xl" />
        <Button
          onPress={async () => {
            // Check if input field is not full
            if(value.length != 6){
              ToastModule.showToast('Incomplete code');
              return;
            }

            // Get verdict
            let verdict = await sendReport(data, value, mFunc.nodeIdRef.current, patient_info);
            // ToastModule.showToast(verdict);

            navigation.replace('reportVerdict', { result: verdict });
          }}
          style={styles.redButton}
          type="warning"
        >
          Confirm
        </Button>
      </WingBlank>

      {/* Pop-up code */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showPopUp}
        onRequestClose={() => console.log('Pop up is closed')}
      >
        <View style={[styles.container, styles.dimBG]}>
          <View style={styles.popUp}>
            <Text style={styles.desc}><B>Please write down the authorization code shown below:</B></Text>
            <Text style={styles.desc}>{token}</Text>
            <WhiteSpace size="sm" />
            <Button
              onPress={() => setShowPopUp(false)}
              style={styles.redButton}
              type="warning"
            >
              OK ({counter})
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/*
Code Reference:
> OTP template
  https://stackoverflow.com/questions/47506829/how-to-design-react-native-otp-enter-screen
  https://www.npmjs.com/package/react-native-confirmation-code-field
> Pop-up
	https://reactnativeforyou.com/how-to-make-react-native-modal-close-automatically/
*/
