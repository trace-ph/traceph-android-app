import Axios from 'axios';
import {API_URL} from '../configs';

const BASE_URL = `${API_URL}/node_contacts`;

export const insertContacts = payload => {
  return Axios.post(BASE_URL, payload);
};
