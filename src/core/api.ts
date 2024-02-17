import axios from 'axios';
import {ANDROID_API_BASE_URL, API_BASE_URL, DEV_ANDROID_API_BASE_URL, DEV_API_BASE_URL} from '@env';
import {Platform} from 'react-native';

// Set DEBUG to true to use the DEV_API_BASE_URL and DEV_ANDROID_API_BASE_URL, cancel current react-native server and run it again with yarn start --reset-cache
export const DEBUG = true;

export const URL = DEBUG ? (Platform.OS === 'android' ? DEV_ANDROID_API_BASE_URL : DEV_API_BASE_URL) : (Platform.OS === 'android' ? ANDROID_API_BASE_URL : API_BASE_URL);

const api = axios.create({
  baseURL: 'http://' + URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
