import Axios from 'axios';
import { API_URL } from '../configs';

const BASE_URL = `${API_URL}/notification`;

export const getNotif = (payload, timeout) => {
  return Axios.post(BASE_URL, payload, { timeout: timeout });
};

export const sendNotif = (payload) => {
  return Axios.post(BASE_URL + '/confirm', payload);
}
