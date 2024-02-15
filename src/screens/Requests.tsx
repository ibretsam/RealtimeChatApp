import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useGlobal from '../core/global';
import Empty from '../common/Empty';
import Cell from '../common/Cell';
import Avatar from '../common/Avatar';
import moment from 'moment';

const RequestRowButton: React.FC<{item: Connection}> = ({item}) => {
  const connectRequest = useGlobal(state => state.connect);
  const acceptRequest = useGlobal(state => state.accept);

  const onPress = () => {
    console.log('Accept');
    acceptRequest(item.sender.username);
  };

  return (
    <View
      style={{
        marginLeft: 20,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        marginTop: 8,
      }}>
      <TouchableOpacity
        style={{backgroundColor: 'tomato', padding: 8, borderRadius: 8}}
        onPress={onPress}>
        <Text style={{color: 'white', textAlign: 'center'}}>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: '#f0f0f0',
          padding: 8,
          marginTop: 8,
          borderRadius: 8,
        }}>
        <Text style={{color: '#505050', textAlign: 'center'}}>Decline</Text>
      </TouchableOpacity>
    </View>
  );
};

const RequestRow: React.FC<{item: Connection}> = ({item}) => {
  return (
    <Cell>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Avatar src={item.sender.thumbnail} size={76} />
        <View
          style={{
            marginLeft: 10,
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}>
          <View style={{marginTop: 5}}>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>
              {item.sender.name}
            </Text>
            <Text style={{color: '#505050', fontSize: 13}}>
              Requested to connect with you
            </Text>
          </View>

          <Text
            style={{
              color: '#505050',
              fontSize: 13,
              marginTop: 4,
            }}>
            {moment(item.updated_at).fromNow()}
          </Text>
        </View>
      </View>
      <RequestRowButton item={item} />
    </Cell>
  );
};

const RequestsScreen: React.FC = () => {
  const requestList = useGlobal(state => state.requestList);

  if (!requestList) {
    return (
      <ActivityIndicator
        size="large"
        color="tomato"
        animating={true}
        style={{flex: 1}}
      />
    );
  }

  if (requestList.length === 0) {
    return <Empty icon={'user-plus'} message={'No requests'} />;
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <FlatList
        data={requestList}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => <RequestRow item={item} />}
      />
    </View>
  );
};

export default RequestsScreen;
