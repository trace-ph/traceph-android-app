import React, {
    useState,
    useEffect,
} from 'react';
import {
    Text,
    View,
} from 'react-native';
import MMKV from 'react-native-mmkv-storage';

import { List, Button, WhiteSpace } from '@ant-design/react-native';
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
        <View>
            <List renderHeader={() => 'Received Notifications'}>
            <Item>
                {Object.keys(notifList)[0]}
                <Brief>{notifList[Object.keys(notifList)[0]]}</Brief>
            </Item>
            <WhiteSpace size="xl" />
            <Item>
                {Object.keys(notifList)[1]}
                <Brief>{notifList[Object.keys(notifList)[1]]}</Brief>
            </Item>
            <WhiteSpace size="xl" />
            <Item>
                {Object.keys(notifList)[2]}
                <Brief>{notifList[Object.keys(notifList)[2]]}</Brief>
            </Item>
            </List>
            <WhiteSpace size="xl" />
            <Button
                onPress={() => setRefresh(true)}
                style={{
                borderRadius: 30,
                width: '90%',
                backgroundColor: '#D63348',
                alignSelf: 'center',
                }}
            >
                Refresh
            </Button>
        </View>
    );
}