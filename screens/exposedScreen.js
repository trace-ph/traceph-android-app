import React from 'react';
import {
	Text,
  ScrollView,
  Image,
	Linking,
  Clipboard,
  NativeModules,
} from 'react-native';
// Styles
import styles from './Styles';

import { Button, Flex, WhiteSpace, WingBlank, Card } from '@ant-design/react-native';
const L = props => <Text style={styles.link} onPress={() => Linking.openURL(props.children)}>{props.children}</Text>;
const C = props => <Text style={styles.copy} onPress={() => { Clipboard.setString(props.children); ToastModule.showToast("Copied " + props.children);}}>{props.children}</Text>;

const {ToastModule} = NativeModules;

// Infographics
const homeQuarantine = require('../assets/HQ_Infographic.png');
const covidPrevention = require('../assets/CP_Infographic.png');
const qrImg = require('../assets/qr.png');

const copyToClipboard = () => {
  Clipboard.setString('https://endcov.ph/');
  ToastModule.showToast('Copied to Clipboard');
};


// Screen that shows what to do when exposed + Contacts list
export default function exposedTutorial(){	
	return(
		<ScrollView style={styles.defaultView}>
			<WingBlank size="lg" style={{paddingHorizontal: '2%'}}>
				<WhiteSpace size="xl" />
				<Text style={styles.headerText}>
					What to do when exposed?
				</Text>
				<WingBlank size="lg">
					<Text style={styles.desc}>
						When you received an exposed notification, do follow these guidelines:
					</Text>
				</WingBlank>
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
				<WhiteSpace size="xl" />
				<WhiteSpace size="xl" />

				<WingBlank size="lg">
					<Text style={styles.desc}>
						You may also go to the following sites for more information about COVID-19:
					</Text>
					<WhiteSpace size="lg" />
					
					<Card>
						<Card.Header title="Endcov.ph" />
						<Card.Body><WingBlank size="lg"><Text style={styles.cardDesc}>
							- COVID-19 Tracker: <L>https://endcov.ph/</L>
						</Text>
						<Image
							source={qrImg}
							style={{
								width: 150,
								height: 150,
								alignSelf: 'center',
							}}
						/>
					</WingBlank></Card.Body>
					</Card>
					<WhiteSpace size="lg" />

					<Card>
						<Card.Header title="Department of Health" />
						<Card.Body><WingBlank size="lg"><Text style={styles.cardDesc}>
							- COVID-19 Tracker: <L>https://doh.gov.ph/covid19tracker</L>{'\n'}
							- FAQ: <L>https://doh.gov.ph/COVID-19/FAQs</L>{'\n'}
							- Updates: <L>https://doh.gov.ph/2019-nCoV</L>
						</Text></WingBlank></Card.Body>
					</Card>
					<WhiteSpace size="lg" />
			
					<Card>
						<Card.Header title="COVID-19 Dashboard" />
						<Card.Body><WingBlank size="lg"><Text style={styles.cardDesc}>
							- What is COVID-19: <L>https://www.covid19.gov.ph/health/what-is-covid-19</L>{'\n'}
							- Home Quaratine: <L>https://www.covid19.gov.ph/health/home-quarantine</L>{'\n'}
							- FAQ: <L>https://www.covid19.gov.ph/frequently-asked-questions</L>
						</Text></WingBlank></Card.Body>
					</Card>
				</WingBlank>
				<WhiteSpace size="xl" />
				<WhiteSpace size="xl" />
			
				<Text style={styles.headerText}>
					Who to contact when exposed or showing symptoms?
				</Text>
				<WingBlank size="lg">
					<Text style={styles.desc}>
						You may contact the following for COVID-19 inquiries.
					</Text>
					<WhiteSpace size="lg" />
					
					<Card>
						<Card.Header title="University Health Service (UHS)" />
						<Card.Body><WingBlank size="lg"><Text style={styles.cardDesc}>
							For all UP-mandated clientele and residents:{'\n'}
							- Facebook: <L>https://www.facebook.com/UPDHealthService/</L>{'\n'}
							- Number: <C>8981-8500 local 2702</C>{'\n'}
							- Email: <C>uphs@upd.edu.ph</C>{'\n'}
							- For appointment: <C>uphs.appointlet.com</C>
						</Text></WingBlank></Card.Body>
					</Card>
					<WhiteSpace size="lg" />

					<Card>
						<Card.Header title="Philippine General Hospital (PGH)" />
						<Card.Body><WingBlank size="lg"><Text style={styles.cardDesc}>
							Free consultation: <L>https://www.facebook.com/pghgabay</L>
						</Text></WingBlank></Card.Body>
					</Card>
					<WhiteSpace size="lg" />

					<Card>
						<Card.Header title="Other hospital contacts" />
						<Card.Body><WingBlank size="lg"><Text style={styles.cardDesc}>
							You may find hospital contacts through this link: <L>https://endcov.ph/hospitals/</L>
							{/* {'\n'}Or you may contact Yani, our Covid chatbot: <L>m.me/YaniEndCovBot</L> */}
						</Text></WingBlank></Card.Body>
					</Card>
				</WingBlank>
				<WhiteSpace size="xl" />
				<WhiteSpace size="xl" />
			</WingBlank>
		</ScrollView>
	);
}