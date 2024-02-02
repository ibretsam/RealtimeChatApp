import axios from 'axios';
import {ANDROID_API_BASE_URL, API_BASE_URL} from '@env';
import {Platform} from 'react-native';

export const URL =
  Platform.OS === 'android' ? ANDROID_API_BASE_URL : API_BASE_URL;

const api = axios.create({
  baseURL: 'http://' + URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
