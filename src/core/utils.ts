import ProfilePicture from '../assets/profile.png';
import {URL} from './api';

const log = (...args: any[]) => {
  Array.from(args).forEach(arg => {
    if (typeof arg === 'object') {
      console.log(JSON.stringify(arg, null, 2));
    } else {
      console.log(arg);
    }
  });
};

const logError = (...args: any[]) => {
  Array.from(args).forEach(arg => {
    if (typeof arg === 'object') {
      console.error(JSON.stringify(arg, null, 2));
    } else {
      console.error(arg);
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
