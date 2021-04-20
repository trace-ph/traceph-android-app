import React from 'react';
import {
	Text,
  ScrollView,
  Image,
	Linking,
} from 'react-native';
// Styles
import styles from './Styles';
const L = props => <Text style={styles.link} onPress={() => Linking.openURL(props.children)}>{props.children}</Text>;

// Infographics
const homeQuarantine = require('../assets/HQ_Infographic.png');
const covidPrevention = require('../assets/CP_Infographic.png');


// Screen that shows what to do when exposed
export default function exposedTutorial(){	
	return(
		<ScrollView>
			<Text style={styles.headerText}>
				What to do when exposed?
			</Text>
			<Image
				source={homeQuarantine}
				resizeMode="contain"
				style={{
					width: '100%',
					height: undefined,
					aspectRatio: 1,
				}}
			/>
			<Image
				source={covidPrevention}
				resizeMode="contain"
				style={{
					width: '100%',
					height: undefined,
					aspectRatio: 0.7,
				}}
			/>
			<Text style={styles.subText}>
				Infographics from <L>https://up.edu.ph/covid-19-updates/#about-covid-19</L>
			</Text>
		</ScrollView>
	);
}