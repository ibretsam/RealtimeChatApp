import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Text, View} from 'react-native';

interface EmptyProps {
  icon: IconProp;
  message: string;
  centered?: boolean;
}

const Empty: React.FC<EmptyProps> = ({icon, message, centered = true}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: centered ? 'center' : 'flex-start',
        alignItems: 'center',
        paddingVertical: 120,
      }}>
      <FontAwesomeIcon icon={icon} size={64} color="#e0e0e0" />
      <Text style={{fontSize: 18, color: '#e0e0e0', marginTop: 16}}>
        {message}
      </Text>
    </View>
  );
};

export default Empty;
