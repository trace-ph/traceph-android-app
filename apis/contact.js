import Axios from 'axios';
import {API_URL} from '../configs';

const BASE_URL = `${API_URL}/node_contacts`;

export const insertContacts = payload => {
  return Axios({
    method: 'post',
    timeout: 5000,
    url: BASE_URL,
    data: payload,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
