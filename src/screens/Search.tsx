import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useEffect, useLayoutEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {RootStackParamList} from '../../App';
import Empty from '../common/Empty';
import Avatar from '../common/Avatar';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import useGlobal from '../core/global';
import Cell from '../common/Cell';

interface SearchRowProps {
  user: SearchUser;
}

const SearchButton: React.FC<SearchRowProps> = ({user}) => {
  if (user.status === 'connected') {
    return (
      <FontAwesomeIcon
        icon="check"
        size={20}
        color="#505050"
        style={{marginLeft: 16}}
      />
    );
  }
  interface SearchButtonData {
    text?: string;
    icon?: IconProp;
    disabled?: boolean;
    onPress?: () => void;
  }
  const data: SearchButtonData = {};

  const connectRequest = useGlobal(state => state.connect);
  const acceptRequest = useGlobal(state => state.accept);

  switch (user.status) {
    case 'not-connected':
      data.text = 'Add';
      data.icon = 'user-plus';
      data.disabled = false;
      data.onPress = () => {
        console.log('Add');
        connectRequest(user.username);
      };
      break;
    case 'pending-me':
      data.text = 'Pending';
      data.icon = 'clock';
      data.disabled = true;
      break;
    case 'pending-them':
      data.text = 'Accept';
      data.icon = 'check';
      data.disabled = false;
      data.onPress = () => {
        console.log('Accept');
        acceptRequest(user.username);
      };
      break;
    default:
      break;
  }

  return (
    <TouchableOpacity
      onPress={data.onPress}
      disabled={data.disabled}
      style={{
        backgroundColor: data.disabled ? '#f0f0f0' : 'tomato',
        padding: 8,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      {data.icon === undefined ? null : (
        <FontAwesomeIcon
          icon={data.icon}
          size={16}
          color={data.disabled ? '#a0a0a0' : 'white'}
          style={{
            marginRight: 8,
          }}
        />
      )}
      <Text
        style={{
          color: data.disabled ? '#a0a0a0' : 'white',
          fontSize: 12,
        }}>
        {data.text}
      </Text>
    </TouchableOpacity>
  );
};

const SearchRow: React.FC<SearchRowProps> = ({user}) => {
  return (
    <Cell>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Avatar src={user.thumbnail} size={40} />
        <View style={{marginLeft: 16}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 18,
            }}>
            {user.name}
          </Text>
          <Text
            style={{
              color: '#505050',
              fontSize: 13,
            }}>
            @{user.username}
          </Text>
        </View>
      </View>

      <SearchButton user={user} />
    </Cell>
  );
};

type SearchScreenProps = NativeStackScreenProps<RootStackParamList, 'Search'>;

const SearchScreen: React.FC<SearchScreenProps> = ({navigation}) => {
  const [query, setQuery] = useState<string>('');

  const searchList = useGlobal(state => state.searchList);

  const searchUser = useGlobal(state => state.searchUser);

  useEffect(() => {
    searchUser(query);
  }, [query]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerBackTitleVisible: false,
      headerTintColor: 'tomato',
    });
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{padding: 16, borderBottomWidth: 1, borderColor: '#f0f0f0'}}>
        <TextInput
          style={{
            fontSize: 18,
            padding: 8,
            borderRadius: 8,
            backgroundColor: '#f0f0f0',
            paddingLeft: 40,
          }}
          value={query}
          onChangeText={setQuery}
          placeholder="Search"
          placeholderTextColor="#b0b0b0"
          autoCapitalize="none"
          autoFocus={true}
        />
        <FontAwesomeIcon
          icon="search"
          size={20}
          color="#505050"
          style={{position: 'absolute', top: 25, left: 26}}
        />
      </View>

      {searchList === null || searchList.length === 0 ? (
        <Empty
          icon={query === '' ? 'magnifying-glass' : 'triangle-exclamation'}
          message={
            query === ''
              ? 'Search for something'
              : 'No users found for "' + query + '"'
          }
          centered={false}
        />
      ) : (
        <FlatList
          data={searchList}
          renderItem={({item}) => <SearchRow user={item} />}
          keyExtractor={item => item.username}
        />
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;
