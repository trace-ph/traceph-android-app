import Axios, {CancelToken} from 'axios';
import {API_URL} from '../configs';

const BASE_URL = `${API_URL}/node_contacts`;

export const insertContacts = (payload, cancel) => {
  return Axios({
    method: 'post',
    timeout: 5000,
    cancelToken: new CancelToken(c => (cancel.exec = c)),
    url: BASE_URL,
    data: payload,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
