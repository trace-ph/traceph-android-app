import React, { useEffect, useContext, useState } from 'react';
import {
  View,
	Image,
} from 'react-native';
import styles from './Styles';
import { sleep } from '../utilities/getNotification';

import FxContext from '../FxContext';
const icon = require('../assets/DetectPH_transparent.png');
import {Flex} from '@ant-design/react-native';


export default function SplashScreen({ navigation }){
  const {mFunc, setMFunc} = useContext(FxContext);
	const [canCheck, setCanCheck] = useState(false);

	useEffect(async () => {
		// Delay first since useContext doesn't load as quickly
		let delay = 2000;
		await sleep(delay);
		setCanCheck(true)
	}, []);

	useEffect(() => {
		if(!canCheck)
			return;

		// Checks if already registered
		mFunc.fetchNodeID()
		.then(() => {		// Is registered, enable Bluetooth
			mFunc.enableBluetooth()
			.then(() => navigation.replace('Drawer'))
			.catch(err => {
				console.log('err', err);
				navigation.replace('askForBluetooth');
			});
		})
		.catch(() => {		// Is not registered, go to greetingScreen
			navigation.replace('Greet');
		});
	}, [canCheck]);

	return(
		<View style={styles.defaultView}>
		<Flex direction="column" align="center" style={{marginTop: '50%'}}>
			<Image
				source={icon}
				resizeMode="contain"
				style={{
					width: '100%',
					height: undefined,
					aspectRatio: 1,
				}}
			/>
		</Flex>
		</View>
	);
}