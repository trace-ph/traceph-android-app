import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
/*
	The drawer navigation has some particularities, specifically in the react-native-reanimated
	They aren't seen in most tutorials so see the link below
	@see https://docs.swmansion.com/react-native-reanimated/docs/installation/

	Some errors of reanimated only asks for you to reset cache or fresh install node modules
*/
import { createDrawerNavigator } from '@react-navigation/drawer';

import SharingScreen from './sharingScreen';
import GreetingScreen from './greetingScreen';
import AskBluScreen from './askForBluetoothScreen';
import QRscanner from './QRscanScreen';
import inputToken from './inputTokenScreen';
import reportVerdict from './reportVerdictScreen';
import startReport from './startReportScreen';
import showNotification from './showNotification';
import exposedTutorial from './exposedScreen';
import contactList from './contactsScreen';
import aboutUsScreen from './aboutUsScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


// Stack navigator of BLE
const BLENavigator = () => {
	return (
		<Stack.Navigator initialRouteName="Sharing" headerMode="none">
			<Stack.Screen name="Sharing" component={SharingScreen} />
		</Stack.Navigator>
	);
}

// Stack navigator of Report
const ReportNavigator = () => {
	return(
		<Stack.Navigator initialRouteName="home" headerMode="none">
			<Stack.Screen name="home" component={startReport} />
			<Stack.Screen name="QRscanner" component={QRscanner} />
			<Stack.Screen name="inputToken" component={inputToken} />
			<Stack.Screen name="reportVerdict" component={reportVerdict} />
		</Stack.Navigator>
	);
}

const DrawerNavigator = () => {
	return(
		<Drawer.Navigator initialRouteName="Contact-tracing">
			<Drawer.Screen name="Contact-tracing" component={BLENavigator} />
			<Drawer.Screen name="Report" component={ReportNavigator} />
			<Drawer.Screen name="Received notifications" component={showNotification} />
			<Drawer.Screen name="When exposed" component={exposedTutorial} />
			<Drawer.Screen name="Contact list" component={contactList} />
			<Drawer.Screen name="About Us" component={aboutUsScreen} />
		</Drawer.Navigator>
	);
}


// Would be put in the render of App.js
export default function screens(){
	return(
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Greet" headerMode="none">
				<Stack.Screen name="Greet" component={GreetingScreen} />
				<Stack.Screen name="Drawer" component={DrawerNavigator} />
				<Stack.Screen name="askForBluetooth" component={AskBluScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}