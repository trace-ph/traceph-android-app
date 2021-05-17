import React, {useContext, useState} from 'react';
import {
  Text,
  View,
  Modal,
} from 'react-native';
import styles from './Styles';

import {Button, Flex, WhiteSpace, WingBlank} from '@ant-design/react-native';


// Shows verdict of the report
export default function reportVerdict( {route, navigation} ) {
  // Get the parameters
  const { result } = route.params;
  let verdict = '';
	const [showPopUp, setShowPopUp] = useState(true);

  // Verdict text
  if(result == 'scan')
    verdict = 'Sorry but your report could not be made. It\'s possible that you may have reported before or your QR code is broken.';
  else if(result == 'expired')
    verdict = 'Sorry but your report could not be made. Your QR code is expired';
  else if(result == 'denied')
    verdict = 'Sorry but your report could not be made. This QR code has already been reported';
  else if(result == 'accepted')
    verdict = 'Report accepted';
  else 
    verdict = 'Wrong input code';


  return (
    <View style={styles.defaultView}>
      {/* Pop-up code */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showPopUp}
        onRequestClose={() => console.log('Confirmation is closed')}
      >
        <View style={[styles.container, styles.dimBG]}>
          <View style={styles.popUp}>
            <Text style={styles.headerText}>
              Report verdict:
            </Text>
            <Text style={[styles.desc, { textAlign: 'center' }]}>
              {verdict}
            </Text>
            <WhiteSpace size="xl" />

            <Button
              onPress={() => navigation.popToTop()}    // Pop to the startReport screen from stack
              style={styles.redButton}
              type="warning"
            > 
            Ok
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}
