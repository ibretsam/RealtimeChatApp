import DeviceInfo from 'react-native-device-info';
import ProfilePicture from '../assets/profile.png';
import {URL} from './api';

const log = (...args: any[]) => {
  Array.from(args).forEach(arg => {
    if (typeof arg === 'object') {
      DeviceInfo.getDeviceName().then(deviceName => {
        console.log(deviceName + ': ' + JSON.stringify(arg, null, 2));
      });
    } else {
      DeviceInfo.getDeviceName().then(deviceName => {
        console.log(deviceName + ': ' + arg);
      });
    }
  });
};

const logError = (...args: any[]) => {
  Array.from(args).forEach(arg => {
    if (typeof arg === 'object') {
      DeviceInfo.getDeviceName().then(deviceName => {
        console.error(deviceName + ': ' + JSON.stringify(arg, null, 2));
      });
    } else {
      DeviceInfo.getDeviceName().then(deviceName => {
        console.error(deviceName + ': ' + arg);
      });
    }
  });
};

const thumbnail = (url: string | undefined) => {
  if (!url) return ProfilePicture;

  let imageUri = '';
  if (url.startsWith('http')) {
    imageUri = url;
  } else {
    imageUri = 'http://' + URL + url;
  }
  return {uri: imageUri};
};

export {log, logError, thumbnail};
