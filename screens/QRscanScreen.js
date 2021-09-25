import React from 'react';
import {
  View,
  Text,
  Modal,
  ActivityIndicator,
} from 'react-native';

import {
  List,
  Button,
  WhiteSpace,
  WingBlank,
  Card
} from '@ant-design/react-native';

import styles from './Styles';
import FxContext from '../FxContext';
import { getToken } from '../apis/report';

// For the QR code scanner camera
import QRCodeScanner from 'react-native-qrcode-scanner';
import * as ImagePicker from 'react-native-image-picker';


export default class QRscanner extends React.Component {
	static contextType = FxContext;

  constructor(props) {
    super(props);
    this.state = {
      isCameraOpen: false,
      showModal: true,
      showText: false,
      resourcePath: ''
    };
  }

  // When QR code is scanned, send data to auth-api
  onSuccess = async (e) => {
    this.setState({          // Closes camera once scanned
      isCameraOpen: false,
      showText: true,
    }); 
    console.log(e.data);    // Show in the Metro server log

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

  /* To select an image from photo gallery */
  selectImage = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
    }

    console.log('Image Picker opened');
    ImagePicker.launchImageLibrary(options, response => {
      console.log('Response: ', response);

      if (response.didCancel) {
        console.log("User cancelled Picker");
      }
      else if (response.error) {
        console.error("ImagePicker ERROR: ", response.error);
      }
      else {
        let source = {
          uri: 'data:image/jpeg;base64,' + response.data,
          isStatic: true
        };
        // this.setState({resourcePath: source});
      }
    });
  }



  render(){
    return (
      <View style={[styles.defaultView, {alignItems: 'center', justifyContent: 'center'}]}>
        {/* Pop-up code */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.showModal}
          onRequestClose={() => console.log("QR modal close")}
        >
          <View style={[styles.container, styles.dimBG]}>
            <View style={styles.popUp}>
              <Text style={[styles.desc, { textAlign: 'center' }]}>
                Report QR Code is required
              </Text>
              <WhiteSpace size="xl" />

              <Button
                onPress={() => {
                  this.setState({
                    isCameraOpen: true,
                    showModal: false
                  });
                }}
                style={styles.redButton}
                type="warning"
              > 
              Open Camera to scan
              </Button>

              <WhiteSpace />

              <Button
                onPress = {()=>this.selectImage()}
                style = {styles.whiteButton}
              >
              Choose from Gallery
              </Button>

            </View>
          </View>
        </Modal>

        {/* Opens camera and scan QR code */}
        {this.state.isCameraOpen && (<QRCodeScanner
          onRead={this.onSuccess.bind(this)}
          reactivate={true}
          reactivateTimeout={4000}/>
        )}
        {this.state.showText && (<>
          <Text style={styles.desc}>
            Checking your QR code
          </Text>
          <ActivityIndicator
            animating={true}
            color = '#0888E2'
            size={'large'} />
        </>)}
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
