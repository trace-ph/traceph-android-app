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
  SafeAreaView,
} from 'react-native';

const {ToastModule} = NativeModules;

import {Button, Flex, WhiteSpace, WingBlank} from '@ant-design/react-native';

// For OTP input fields
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 
'react-native-confirmation-code-field';

// For sending info via HTTP
import Axios from 'axios';


// Checks the input token
// Returns verdict message
async function tokenCheck(data, token, input){
  if(token == input){
    const reportURL = 'http://192.168.0.14:3001/api/qr/report';
    let verdict = await Axios.get(reportURL, 
      { params: {     // Parameters to send
        node_id: "D", 
        data: data,
        token: input, 
    }})
    // .then((res) => console.log(res))
    .catch((err) => console.error(err));

    // return verdict.body;
    return verdict.data;

  } else 
    return 'Wrong input code';
}


export default function inputToken( {route, navigation} ) {
  // Get the parameters and context
  const { data, token } = route.params;
  // const { mFunc, setMFunc } = useContext(FxContext);

  // Code field parameters
  const CELL_COUNT = 6;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });


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
          let verdict = await tokenCheck(data, token, value);
          // ToastModule.showToast(verdict);

          navigation.replace('reportVerdict', { verdict: verdict });
        }}
        style={{
          borderRadius: 30,
          width: '90%',
          backgroundColor: '#D63348',
          alignSelf: 'center',
        }}
      >
        Submit
      </Button>
    </SafeAreaView>
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

  //Styles for the OTP input fields 
  root: {padding: 20, minHeight: 300},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {
    marginTop: 20,
    width: 280,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cellRoot: { // Style of the underline input field
    width: 30,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  cellText: {
    color: '#000',
    fontSize: 20,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: '#007AFF',
    borderBottomWidth: 2,
  },
});

/*
Code Reference:
> OTP template
  https://stackoverflow.com/questions/47506829/how-to-design-react-native-otp-enter-screen
  https://www.npmjs.com/package/react-native-confirmation-code-field
*/