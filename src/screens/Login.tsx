import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleProp,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {RootStackParamList} from '../../App';
import {useLayoutEffect, useState} from 'react';
import Title from '../common/Title';
import Input from '../common/Input';
import Button from '../common/Button';
import api, { URL } from '../core/api';
import {API_BASE_URL} from '@env';
import {log} from '../core/utils';
import useGlobal from '../core/global';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const login = useGlobal(state => state.login);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: true,
      fullScreenGestureEnabled: true,
    });
  }, []);

  const validate = () => {
    if (username === '') {
      setUsernameError('Username is required');
    } else {
      setUsernameError('');
    }

    if (password === '') {
      setPasswordError('Password is required');
    } else {
      setPasswordError('');
    }

    return username !== '' && password !== '';
  };

  const onLogin = () => {
    log('Login');

    if (validate()) {
      log('Validated');
      log(URL);
      api({
        method: 'POST',
        url: '/api/chat/login/',
        data: {
          username,
          password,
        },
      })
        .then(res => {
          log(res.data);
          const user = res.data.user;
          const tokens = res.data.tokens;
          const {access, refresh} = tokens;
          login(access, refresh, user);
        })
        .catch(err => {
          log(err);
          log(err.response.data);
        });
    } else {
      log('Invalid');
      return;
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
        }}>
        <TouchableWithoutFeedback
          onPress={() => Keyboard.dismiss()}
          style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Title text="Login" color="tomato" style={{marginBottom: 30}} />
            <Input
              title="Username"
              value={username}
              setValue={setUsername}
              error={usernameError}
              setError={setUsernameError}
              autoCapitalize="none"
            />
            <Input
              title="Password"
              value={password}
              setValue={setPassword}
              error={passwordError}
              setError={setPasswordError}
              isPassword={true}
              autoCapitalize="none"
            />
            <Button text="Login" onPress={onLogin} style={{marginTop: 15}} />
            <Text style={{marginTop: 15, color: 'gray'}}>
              Don't have an account?{' '}
              <Text
                style={{color: 'tomato'}}
                onPress={() => navigation.navigate('Register')}>
                Register
              </Text>
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
