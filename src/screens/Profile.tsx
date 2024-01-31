import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import useGlobal from '../core/global';

const ProfileLogout: React.FC = () => {
  const logout = useGlobal(state => state.logout);

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        height: 52,
        borderRadius: 26,
        backgroundColor: 'tomato',
        alignItems: 'center',
        paddingHorizontal: 26,
        marginTop: 40,
      }}
      onPress={logout}>
      <FontAwesomeIcon
        icon="sign-out-alt"
        size={22}
        color="white"
        style={{marginRight: 16}}
      />
      <Text style={{fontWeight: 'bold', color: 'white'}}>Logout</Text>
    </TouchableOpacity>
  );
};

const ProfileScreen: React.FC = () => {
  const user = useGlobal(state => state.user);

  return (
    <View style={{flex: 1, alignItems: 'center', paddingTop: 100}}>
      <Image
        source={require('../assets/profile.png')}
        style={{
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: '#e0e0e0',
          marginBottom: 20,
        }}
      />
      <Text style={{fontSize: 24, marginTop: 16}}>{user?.name}</Text>
      <Text style={{fontSize: 16, marginTop: 8}}>@{user?.username}</Text>
      <ProfileLogout />
    </View>
  );
};

export default ProfileScreen;
