import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  FlatList,
  InputAccessoryView,
  Keyboard,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {RootStackParamList} from '../../App';
import React, {useEffect, useLayoutEffect} from 'react';
import Avatar from '../common/Avatar';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import useGlobal from '../core/global';
import {log} from '../core/utils';

const MessageBubble: React.FC<{message: Message; friend: User}> = ({
  message,
  friend,
}) => {
  const user = useGlobal(state => state.user);
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: message.is_my_message ? 'flex-end' : 'flex-start',
        marginBottom: 10,
      }}>
      {!message.is_my_message && (
        <View
          style={{
            justifyContent: 'center',
            marginLeft: 10,
            marginRight: 10,
          }}>
          <Avatar src={friend.thumbnail} size={30} />
        </View>
      )}
      <View
        style={{
          backgroundColor: message.is_my_message ? 'tomato' : '#e0e0e0',
          padding: 10,
          borderRadius: 10,
          maxWidth: '80%',
        }}>
        <Text
          style={{
            color: message.is_my_message ? 'white' : 'black',
          }}>
          {message.content}
        </Text>
      </View>
      {message.is_my_message && (
        <View
          style={{
            justifyContent: 'center',
            marginLeft: 10,
            marginRight: 10,
          }}>
          {/* <Avatar src={user?.thumbnail} size={30} /> */}
        </View>
      )}
    </View>
  );
};

interface MessageHeaderProps {
  friend: User;
}
const MessageHeader: React.FC<MessageHeaderProps> = ({friend}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: 60,
        flex: 1,
      }}>
      <View></View>
      <View
        style={{
          justifyContent: 'center',
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 18, color: '#202020'}}>
          {friend.name || '@' + friend.username}
        </Text>
      </View>
      <View
        style={{
          justifyContent: 'center',
        }}>
        <Avatar src={friend.thumbnail} size={40} />
      </View>
    </View>
  );
};

interface MessageInputProps {
  message: string;
  setMessage: (text: string) => void;
  onSend: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  onSend,
}) => {
  const [disabled, setDisabled] = React.useState<boolean>(true);

  const handleInput = (text: string) => {
    setMessage(text);
    setDisabled(text.length === 0);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
      }}>
      <View
        style={{
          flex: 1,
          marginRight: 10,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#e0e0e0',
          padding: 10,
        }}>
        <TextInput
          placeholder="Type a message"
          value={message}
          onChangeText={handleInput}
          autoFocus={true}
        />
      </View>
      <TouchableOpacity disabled={disabled} onPress={onSend}>
        <FontAwesomeIcon
          icon="circle-arrow-up"
          size={24}
          color={disabled ? 'gray' : 'tomato'}
        />
      </TouchableOpacity>
    </View>
  );
};

type MessagesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Message'
>;

const MessagesScreen: React.FC<MessagesScreenProps> = ({navigation, route}) => {
  const connection = route.params.connection;
  const [message, setMessage] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);

  const onSend = () => {
    const cleanedMessage = message.replace(/\s+/g, ' ').trim();
    if (cleanedMessage.length > 0) {
      console.log('Send message:', cleanedMessage);
      setMessage('');
    } else {
      return;
    }
    messageSend(cleanedMessage, connection);
  };

  const messagesList = useGlobal(state => state.messagesList);
  const messageList = useGlobal(state => state.messageList);
  const messageSend = useGlobal(state => state.messageSend);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: props => <MessageHeader friend={connection.friend} />,
      headerBackTitleVisible: false,
      headerTintColor: 'tomato',
    });
  });

  useEffect(() => {
    messageList(connection);
  }, []);

  if (!messagesList) {
    return (
      <ActivityIndicator
        size="large"
        color="tomato"
        animating={true}
        style={{flex: 1}}
      />
    );
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            padding: 10,
            marginBottom: Platform.OS === 'ios' ? 50 : 0,
          }}>
          <FlatList
            automaticallyAdjustKeyboardInsets={true}
            contentContainerStyle={{
              paddingTop: 30,
            }}
            data={messagesList}
            inverted={true}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <MessageBubble message={item} friend={connection.friend} />
            )}
          />
        </View>
      </TouchableWithoutFeedback>
      {Platform.OS === 'ios' ? (
        <InputAccessoryView>
          <MessageInput
            message={message}
            setMessage={setMessage}
            onSend={onSend}
          />
        </InputAccessoryView>
      ) : (
        <MessageInput
          message={message}
          setMessage={setMessage}
          onSend={onSend}
        />
      )}
    </SafeAreaView>
  );
};

export default MessagesScreen;
