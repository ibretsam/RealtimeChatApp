import {Text} from 'react-native';

interface TitleProps {
  text: string;
  color?: string;
}

const Title: React.FC<TitleProps> = ({text, color}) => {
  return (
    <Text
      style={{
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
