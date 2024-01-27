import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {RootStackParamList} from '../../App';
import {useLayoutEffect, useState} from 'react';
import Title from '../common/Title';
import Input from '../common/Input';
import Button from '../common/Button';

type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Register'
>;

const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');

  const [nameError, setNameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [confirmError, setConfirmError] = useState<string>('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const validate = () => {
    if (name === '') {
      setNameError('Name is required');
    } else {
      setNameError('');
    }

    if (email === '') {
      setEmailError('Email is required');
    } else {
      setEmailError('');
    }

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

    if (confirm === '') {
      setConfirmError('Confirm Password is required');
    } else {
      setConfirmError('');
    }

    if (password !== confirm) {
      setConfirmError('Confirm Password must match Password');
    }

    if (
      name !== '' &&
      email !== '' &&
      username !== '' &&
      password !== '' &&
      confirm !== '' &&
      password === confirm
    ) {
      return true;
    } else {
      return false;
    }
  };

  const onRegister = () => {
    console.log('Register');
    if (validate()) {
      console.log('Validated');

      // TODO: Register
    } else {
      console.log('Not Validated');
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
            <Title text="Register" color="tomato" style={{marginBottom: 30}} />
            <Input
              title="Name"
              value={name}
              setValue={setName}
              error={nameError}
              setError={setNameError}
              autoCapitalize="words"
            />
            <Input
              title="Email"
              value={email}
              setValue={setEmail}
              error={emailError}
              setError={setEmailError}
              autoCapitalize="none"
            />
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
            <Input
              title="Confirm Password"
              value={confirm}
              setValue={setConfirm}
              error={confirmError}
              setError={setConfirmError}
              isPassword={true}
              autoCapitalize="none"
            />
            <Button
              text="Register"
              onPress={onRegister}
              style={{marginTop: 15}}
            />
            <Text style={{marginTop: 15, color: 'gray'}}>
              Already have an account?{' '}
              <Text
                style={{color: 'tomato'}}
                onPress={() => navigation.navigate('Login')}>
                Login
              </Text>
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
