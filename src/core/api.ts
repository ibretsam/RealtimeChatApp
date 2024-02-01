import axios from 'axios';
import {ANDROID_API_BASE_URL, API_BASE_URL} from '@env';
import {Platform} from 'react-native';

let url = API_BASE_URL;
if (Platform.OS === 'android') {
  url = ANDROID_API_BASE_URL;
}

const api = axios.create({
  baseURL: url,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
