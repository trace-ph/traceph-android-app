import React, {
    useState,
    useEffect,
} from 'react';
import {
    Text,
    ScrollView,
} from 'react-native';
import styles from './Styles';
import MMKV from 'react-native-mmkv-storage';

import { List, Button, WhiteSpace, WingBlank, Card } from '@ant-design/react-native';
const Item = List.Item;
const Brief = Item.Brief;


// Shows the saved notification found in local storage
export default function showNotification(){
	const [notifList, setNotifList] = useState([]);
	const [refresh, setRefresh] = useState(false);

	useEffect(async () => {
		var MmkvStore = new MMKV.Loader().withInstanceID('notificationLogs');
		MmkvStore = await MmkvStore.initialize();
		setNotifList(JSON.parse(await MmkvStore.getStringAsync('notif')));
		setRefresh(false);
	}, [refresh]);
	
	return(
		<ScrollView style={styles.defaultView}>
			<WingBlank size="lg" style={{paddingHorizontal: '5%'}}>
				<WhiteSpace size="xl" />
				<Text style={styles.headerText}>
					Received notification
				</Text>
				<WingBlank size="lg">
					<Text style={styles.desc}>
						The 3 latest notifcations that says you're a probable close contact can be viewed here:
					</Text>
					<WhiteSpace size="lg" />

					<Card>
						<Card.Header title={"Date when notification is received"} />
						<Card.Body><WingBlank size="lg"><Text style={styles.cardDesc}>
						Notification details
						</Text></WingBlank></Card.Body>
					</Card>
					<WhiteSpace size="lg" />

					<Card>
						<Card.Header title={Object.keys(notifList)[0]} />
						<Card.Body><WingBlank size="lg"><Text style={styles.cardDesc}>
						{notifList[Object.keys(notifList)[0]]}
						</Text></WingBlank></Card.Body>
					</Card>
					<WhiteSpace size="lg" />

					<Card>
						<Card.Header title={Object.keys(notifList)[1]} />
						<Card.Body><WingBlank size="lg"><Text style={styles.cardDesc}>
						{notifList[Object.keys(notifList)[1]]}
						</Text></WingBlank></Card.Body>
					</Card>
					<WhiteSpace size="lg" />

					<Card>
						<Card.Header title={Object.keys(notifList)[2]} />
						<Card.Body><WingBlank size="lg"><Text style={styles.cardDesc}>
						{notifList[Object.keys(notifList)[2]]}
						</Text></WingBlank></Card.Body>
					</Card>
					<WhiteSpace size="xl" />
				</WingBlank>
				
				<Button
					onPress={() => setRefresh(true)}
					style={styles.redButton}
					type="warning"
				>
					Refresh
				</Button>
			</WingBlank>
		</ScrollView>
	);
}