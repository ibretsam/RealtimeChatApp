import EncryptedStorage from 'react-native-encrypted-storage';
import {logError} from './utils';

const set = async (key: string, value: string) => {
  try {
    await EncryptedStorage.setItem(key, value);
  } catch (error) {
    logError('Secure set error: ' + error);
  }
};

const get = async (key: string) => {
  try {
    const value = await EncryptedStorage.getItem(key);
    return value ?? null;
  } catch (error) {
    logError('Secure get error: ' + error);
  }
};

const remove = async (key: string) => {
  try {
    await EncryptedStorage.removeItem(key);
  } catch (error) {
    logError('Secure remove error: ' + error);
  }
};

const clear = async () => {
  try {
    await EncryptedStorage.clear();
  } catch (error) {
    logError('Secure clear error: ' + error);
  }
};

export default {set, get, remove, clear};
