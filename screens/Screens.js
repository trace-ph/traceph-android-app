import React from 'react';
import {
	View,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
/*
	The drawer navigation has some particularities, specifically in the react-native-reanimated
	They aren't seen in most tutorials so see the link below
	@see https://docs.swmansion.com/react-native-reanimated/docs/installation/

	Some errors of reanimated only asks for you to reset cache or fresh install node modules
*/
import { createDrawerNavigator } from '@react-navigation/drawer';

import SplashScreen from './SplashScreen';
import SharingScreen from './sharingScreen';
import GreetingScreen from './greetingScreen';
import AskBluScreen from './askForBluetoothScreen';
import QRscanner from './QRscanScreen';
import inputToken from './inputTokenScreen';
import reportVerdict from './reportVerdictScreen';
import startReport from './startReportScreen';
import inputResults from './inputResultsScreen';
import showNotification from './showNotificationScreen';
import exposedScreen from './exposedScreen';
import aboutUsScreen from './aboutUsScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Header
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const darkColor = "#666666";
const lightColor = "#FFFFFF";
const DrawerStruct = (props) => {
	const toggleDrawer = () => { props.navigationProps.toggleDrawer() };

	return (
		<View style={{ flexDirection: 'row' }}>
			<MaterialIcons.Button
				name="menu"
				backgroundColor={lightColor}
				color={darkColor}
				onPress={toggleDrawer}
				size={30}
			/>
    </View>
	);
};
const headerOptions = ({navigation}) => (
	{
		headerLeft: () => (<DrawerStruct navigationProps={navigation} />),
		headerStyle: {
			backgroundColor: lightColor
		},
		headerTintColor: lightColor,
	}
);


// Stack navigator of BLE
const BLENavigator = () => {
	return (
		<Stack.Navigator initialRouteName="Sharing" >
			<Stack.Screen name="Sharing" component={SharingScreen} options={headerOptions} />
		</Stack.Navigator>
	);
}

// Stack navigator of Report
const ReportNavigator = () => {
	return(
		<Stack.Navigator initialRouteName="home" >
			<Stack.Screen name="home" component={startReport} options={headerOptions} />
			<Stack.Screen name="inputResults" component={inputResults} options={{ headerShown: false }} />
			<Stack.Screen name="QRscanner" component={QRscanner} options={{ headerShown: false }} />
			<Stack.Screen name="inputToken" component={inputToken} options={{ headerShown: false }} />
			<Stack.Screen name="reportVerdict" component={reportVerdict} options={{ headerShown: false }} />
		</Stack.Navigator>
	);
}

// Stack navigator of Notification Screen
const NotifNavigator = () => {
	return (
		<Stack.Navigator initialRouteName="Received notifications" >
			<Stack.Screen name="Received notifications" component={showNotification} options={headerOptions} />
		</Stack.Navigator>
	);
}

// Stack navigator of Exposed Screen
const ExposedNavigator = () => {
	return (
		<Stack.Navigator initialRouteName="Sharing" >
			<Stack.Screen name="Sharing" component={exposedScreen} options={headerOptions} />
		</Stack.Navigator>
	);
}

// Stack navigator of About Us
const AboutNavigator = () => {
	return (
		<Stack.Navigator initialRouteName="About Us" >
			<Stack.Screen name="About Us" component={aboutUsScreen} options={headerOptions} />
		</Stack.Navigator>
	);
}

const DrawerNavigator = () => {
	return(
		<Drawer.Navigator initialRouteName="Contact-tracing" >
			<Drawer.Screen name="Contact-tracing" component={BLENavigator} />
			<Drawer.Screen name="Report" component={ReportNavigator} />
			<Drawer.Screen name="Received notifications" component={NotifNavigator} />
			<Drawer.Screen name="When exposed" component={ExposedNavigator} />
			<Drawer.Screen name="About Us" component={AboutNavigator} />
		</Drawer.Navigator>
	);
}


// Would be put in the render of App.js
export default function screens(){
	return(
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Splash" headerMode="none">
				<Stack.Screen name="Splash" component={SplashScreen} />
				<Stack.Screen name="Greet" component={GreetingScreen} />
				<Stack.Screen name="Drawer" component={DrawerNavigator} />
				<Stack.Screen name="askForBluetooth" component={AskBluScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
