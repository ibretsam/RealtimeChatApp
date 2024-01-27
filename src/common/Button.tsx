import {StyleProp, Text, TouchableOpacity} from 'react-native';

interface ButtonProps {
  text: string;
  onPress: () => void;
  style?: StyleProp<object>;
}

const Button: React.FC<ButtonProps> = ({text, style, onPress}) => {
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
      }}
      onPress={onPress}>
      <Text style={{fontSize: 16, color: 'white'}}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
