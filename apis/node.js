import Axios from 'axios';
import { API_URL } from '../configs';

const BASE_URL = `${API_URL}/node`;

export const getNode = (options) => {
    const params = {
        node_id: options.node_id,
        device_id: options.device_id,
        person_id: options.person_id
    };
    return Axios.get(BASE_URL, {
        params
    });
};

export const insertNode = (payload) => {
    return Axios.post(BASE_URL, payload);
};