import {Image} from 'react-native';
import {thumbnail} from '../core/utils';

interface AvatarProps {
  src: string | undefined;
  size: number;
}

const Avatar: React.FC<AvatarProps> = ({src, size}) => {
  return (
    <Image
      source={thumbnail(src)}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#e0e0e0',
      }}
    />
  );
};

export default Avatar;
