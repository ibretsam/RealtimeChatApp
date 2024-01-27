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

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
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
    console.log('Login');

    if (validate()) {
      console.log('Validated');
      // TODO: Login
    } else {
      console.log('Invalid');
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
