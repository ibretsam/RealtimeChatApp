import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useGlobal from '../core/global';
import Empty from '../common/Empty';
import moment from 'moment';
import Avatar from '../common/Avatar';
import Cell from '../common/Cell';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

interface FriendRowProps {
  item: MessagePreview;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'Friends',
    undefined
  >;
}

const FriendRow: React.FC<FriendRowProps> = ({item, navigation}) => {
  const handlePress = () => {
    navigation.navigate('Message', {connection: item});
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Cell>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}>
          <Avatar src={item.friend.thumbnail} size={70} />
          <View
            style={{
              marginLeft: 10,
              flexDirection: 'column',
              justifyContent: 'flex-start',
              flex: 1,
              height: '100%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignContent: 'center',
              }}>
              <Text style={{fontWeight: 'bold', fontSize: 18}}>
                {item.friend.name || '@' + item.friend.username}
              </Text>
              <Text style={{color: 'gray'}}>
                {moment(item.updated_at).fromNow()}
              </Text>
            </View>

            <Text
              style={{color: 'gray', marginTop: 5, fontSize: 15}}
              numberOfLines={2}>
              {item.preview}
            </Text>
          </View>
        </View>
      </Cell>
    </TouchableOpacity>
  );
};

type FriendsScreenProps = NativeStackScreenProps<RootStackParamList, 'Friends'>;

const FriendsScreen: React.FC<FriendsScreenProps> = ({navigation}) => {
  const friendList = useGlobal(state => state.friendList);

  if (!friendList) {
    return (
      <ActivityIndicator
        size="large"
        color="tomato"
        animating={true}
        style={{flex: 1}}
      />
    );
  }

  if (friendList.length === 0) {
    return <Empty icon={'user'} message={'No friends'} />;
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <FlatList
        data={friendList}
        keyExtractor={item => item.friend.username}
        renderItem={({item}) => (
          <FriendRow item={item} navigation={navigation} />
        )}
      />
    </View>
  );
};

export default FriendsScreen;
