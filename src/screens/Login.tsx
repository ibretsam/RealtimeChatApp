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

interface InputProps {
  title: string;
}

const Input: React.FC<InputProps> = ({title}) => {
  const [focused, setFocused] = useState<boolean>(false);

  const borderColor = focused ? 'tomato' : 'gray';
  const borderWidth = focused ? 1 : 0.8;
  const textColor = focused ? 'tomato' : 'black';

  return (
    <View style={{width: '90%'}}>
      <Text style={{fontSize: 16, marginBottom: 10, color: textColor}}>
        {title}
      </Text>
      <TextInput
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          fontSize: 16,
          height: 48,
          borderRadius: 8,
          marginBottom: 16,
          paddingHorizontal: 16,
          borderColor: borderColor,
          borderWidth: borderWidth,
        }}
      />
    </View>
  );
};

interface ButtonProps {
  text: string;
  onPress: () => void;
  style?: StyleProp<object>;
}

const Button: React.FC<ButtonProps> = ({text, style}) => {
  return (
    <TouchableOpacity
      style={{
        ...(style ?? {}),
        width: '90%',
        height: 48,
        borderRadius: 8,
        backgroundColor: 'tomato',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{fontSize: 16, color: 'white'}}>{text}</Text>
    </TouchableOpacity>
  );
};

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

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
            <Input title="Username" />
            <Input title="Password" />
            <Button text="Login" onPress={() => {}} style={{marginTop: 15}} />
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
