import React from 'react';
import {
  View,
  NativeModules,
} from 'react-native';

import FxContext from '../FxContext';

// For the QR code scanner camera
import QRCodeScanner from 'react-native-qrcode-scanner';

import { getToken } from '../apis/report';


export default class QRscanner extends React.Component {
	static contextType = FxContext;

  constructor(props) {
      super(props);
  }

  // When QR code is scanned, send data to auth-api
  onSuccess = async (e) => {
    // Show in the Metro server log
    console.log(e.data);

      // Send the data
    const {mFunc, setMFunc} = this.context;
    getToken(mFunc.nodeIdRef.current, e.data)
    .then((res) => {
      // Already reported status
      if(res.status == 208) {
        this.props.navigation.replace('reportVerdict', {
          result: 'scan'
        });
        
        return;
      }

      // Go to Token input screen when successful
      const { test_result, test_result_date, reference_date } = this.props.route.params;
      this.props.navigation.replace('inputToken', {
        data: e.data,
        token: res.data,
        test_result: test_result,
        test_result_date: test_result_date,
        reference_date: reference_date,
      });
    })

    .catch((err) => {
      // Go to verdict screen if status == 400
      /* Cause of 400 status:
          > QR code is not a QR code of DetectPH
          > QR code could not be decrypted
      */
      console.error(err);
      this.props.navigation.replace('reportVerdict', {
        result: 'scan'
      });
    });
  };

  render(){
    return (
      <View style={{flex:1}}>
        {/* Opens camera and scan QR code */}
        {(<QRCodeScanner
          onRead={this.onSuccess.bind(this)}
          reactivate={true}
          reactivateTimeout={4000}/>
        )}
      </View>
    );
  }
}


/*
Code References:
> QR scanner code
    https://dev.to/aaronsm46722627/embedded-qr-code-scanner-and-browser-in-react-native-5752
    https://stackoverflow.com/questions/58284343/how-to-scan-one-barcode-per-time-react-native-camera
> Switching Screens
    https://blog.logrocket.com/navigating-react-native-apps-using-react-navigation/
    https://reactnavigation.org/docs/navigating
    https://reactnavigation.org/docs/navigation-prop/#reset
*/
