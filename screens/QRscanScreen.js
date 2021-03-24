import React from 'react';
import {
  View,
  NativeModules,
} from 'react-native';

const { ToastModule } = NativeModules;

import FxContext from '../FxContext';

// For the QR code scanner camera
import QRCodeScanner from 'react-native-qrcode-scanner';

// For sending info via HTTP
import Axios from 'axios';
import { API_URL } from '../configs';


export default class QRscanner extends React.Component {
	static contextType = FxContext;

    constructor() {
        super();
    }

    // When QR code is scanned, send data to auth-api
    onSuccess = async (e) => {
        // Show in the Metro server log
        console.log(e.data);

        // Send the data to auth-api
		const authURL = API_URL + '/qr/auth';
		const {mFunc, setMFunc} = this.context;
        Axios.get(authURL,
            { params: {     // Parameters to send
                node_id: mFunc.nodeIdRef.current,
                data: e.data
            }})

        .then((res) => {
            // console.log(res)
            // Go to Token input screen when successful
            ToastModule.showToast(res.data.toString());        // Shows token through Toast

            this.props.navigation.replace('inputToken',
            {     // Parameters to send
                data: e.data,
                token: res.data,          // Token
            });
        })

        .catch((err) => {
            // Go to verdict screen if status == 400
            /* Cause of 400 status:
                > QR code is not a QR code of DetectPH
                > QR code could not be decrypted
                > User has already reported for the day
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
