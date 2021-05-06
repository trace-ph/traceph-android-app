import Axios from 'axios';
import { API_URL } from '../configs';

const BASE_URL = `${API_URL}/report`;
const AUTH_URL = `${BASE_URL}/auth`;

// Checks the input token + sends report details
// Returns verdict message
export async function sendReport(data, input, node_id, patient_info){
  let verdict = await Axios.post(BASE_URL, {
    node_id: node_id,
    patient_info: patient_info,
    data: data,
    token: input,
  })
  // .then((res) => console.log(res))
  .catch((err) => console.error(err));

  return verdict.data;
}

// Get authentication token
export function getToken(node_id, data) {
  return Axios.get(AUTH_URL, {
		params: {
		node_id: node_id,
		data: data,
	}});
}
