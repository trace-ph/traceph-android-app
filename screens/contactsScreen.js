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
const Yani1 = require('../assets/Yani1.png');
const Yani2 = require('../assets/Yani2.png');


// Screen that shows where to find contacts
export default function contactList(){	
	return(
		<ScrollView>
			<Text style={styles.headerText}>
				Who to contact when exposed or showing symptoms?
			</Text>
			<Text style={styles.desc}>
				You may find hospital contacts through this link: <L>https://endcov.ph/hospitals/</L>
			</Text>
			{/* <Text style={styles.desc}>
				Or you may contact Yani, our Covid chatbot: <L>m.me/YaniEndCovBot</L>
			</Text>
			<Image
				source={Yani1}
				resizeMode="contain"
				style={{
					width: '100%',
					height: undefined,
					aspectRatio: 1,
				}}
			/>
			<Image
				source={Yani2}
				resizeMode="contain"
				style={{
					width: '100%',
					height: undefined,
					aspectRatio: 1,
				}}
			/> */}
		</ScrollView>
	);
}