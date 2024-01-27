import {StyleProp, Text} from 'react-native';

interface TitleProps {
  text: string;
  color?: string;
  style?: StyleProp<object>;
}

const Title: React.FC<TitleProps> = ({text, color, style}) => {
  return (
    <Text
      style={{
        ...(style || {}),
        color: color,
        textAlign: 'center',
        fontSize: 48,
        fontFamily: 'LeckerliOne-Regular',
      }}>
      {text}
    </Text>
  );
};

export default Title;
