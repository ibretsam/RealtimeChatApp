import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import useGlobal from '../core/global';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {log, thumbnail} from '../core/utils';
import Avatar from '../common/Avatar';

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

const ProfilePicture: React.FC = () => {
  const user = useGlobal(state => state.user);
  const uploadThumbnail = useGlobal(state => state.uploadThumbnail);

  const {showActionSheetWithOptions} = useActionSheet();

  const showActionSheet = () => {
    showActionSheetWithOptions(
      {
        options: ['Cancel', 'Take Photo', 'Choose from Library'],
        cancelButtonIndex: 0,
      },
      (buttonIndex?: number) => {
        if (buttonIndex !== undefined) {
          switch (buttonIndex) {
            case 1:
              log('Take Photo');
              launchCamera(
                {
                  mediaType: 'photo',
                  saveToPhotos: true,
                  includeBase64: false,
                },
                response => {
                  log(response);
                  if (response.didCancel) return;
                  const file = response.assets?.[0];
                  if (file) {
                    uploadThumbnail(file);
                  }
                },
              );
              break;
            case 2:
              log('Choose from Library');
              launchImageLibrary(
                {
                  mediaType: 'photo',
                  includeBase64: true,
                },
                response => {
                  log(response);
                  if (response.didCancel) return;
                  const file = response.assets?.[0];
                  if (file) {
                    uploadThumbnail(file);
                  }
                },
              );
              break;
            default:
              break;
          }
        }
      },
    );
  };

  return (
    <TouchableOpacity style={{marginBottom: 20}}>
      <Avatar src={user?.thumbnail} size={180} />
      <View>
        <TouchableOpacity
          onPress={showActionSheet}
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            backgroundColor: 'tomato',
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 3,
            borderColor: 'white',
          }}>
          <FontAwesomeIcon icon="camera" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const ProfileScreen: React.FC = () => {
  const user = useGlobal(state => state.user);

  return (
    <View style={{flex: 1, alignItems: 'center', paddingTop: 100}}>
      <ProfilePicture />
      <Text style={{fontSize: 24, marginTop: 16}}>{user?.name}</Text>
      <Text style={{fontSize: 16, marginTop: 8}}>@{user?.username}</Text>
      <ProfileLogout />
    </View>
  );
};

export default ProfileScreen;
