import {useState} from 'react';
import {Text, TextInput, View} from 'react-native';

interface InputProps {
  title: string;
  value?: string;
  setValue?: (value: string) => void;
  error?: string;
  setError?: (value: string) => void;
  isPassword?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const Input: React.FC<InputProps> = ({
  title,
  value,
  setValue,
  error,
  setError,
  isPassword,
  autoCapitalize,
}) => {
  const [focused, setFocused] = useState<boolean>(false);

  const borderColor = focused
    ? 'tomato'
    : error && setError
    ? '#ff5555'
    : 'gray';
  const borderWidth = focused ? 1 : 0.5;
  const textColor = focused ? 'tomato' : 'black';

  return (
    <View style={{width: '90%'}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}>
        <Text style={{fontSize: 16, color: textColor}}>{title}</Text>
        <Text
          style={{
            fontSize: 12,
            color: '#ff5555',
            textAlign: 'right',
          }}>
          {error}
        </Text>
      </View>
      <TextInput
        autoCapitalize={autoCapitalize}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        secureTextEntry={isPassword}
        value={value}
        onChangeText={text => {
          if (setValue) {
            setValue(text);
          }

          if (error && setError) {
            setError('');
          }
        }}
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

export default Input;
