import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Animated,
  Easing,
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
import React, {useEffect, useLayoutEffect, useRef} from 'react';
import Avatar from '../common/Avatar';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import useGlobal from '../core/global';
import {log} from '../core/utils';

const TypingAnimation: React.FC<{offset: number}> = ({offset}) => {
  const y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const TOTAL = 1000;
    const BUMP = 200;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(BUMP * offset),
        Animated.timing(y, {
          toValue: 1,
          duration: BUMP,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(y, {
          toValue: 0,
          duration: BUMP,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(TOTAL - BUMP * 2 - BUMP * offset),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, []);

  const translateY = y.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <Animated.View
      style={{
        width: 8,
        height: 8,
        marginHorizontal: 2,
        borderRadius: 4,
        backgroundColor: '#606060',
        transform: [{translateY}],
      }}
    />
  );
};

const MyMessageBubble: React.FC<{message: string}> = ({message}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
      }}>
      <View
        style={{
          backgroundColor: 'tomato',
          padding: 10,
          borderRadius: 10,
          maxWidth: '80%',
        }}>
        <Text style={{color: 'white'}}>{message}</Text>
      </View>
    </View>
  );
};

const FriendMessageBubble: React.FC<{
  message: string;
  friend: User;
  typing?: boolean;
}> = ({message, friend, typing = false}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 10,
      }}>
      <Avatar src={friend.thumbnail} size={40} />
      {typing ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginLeft: 10,
            alignItems: 'center',
          }}>
          <TypingAnimation offset={0} />
          <TypingAnimation offset={1} />
          <TypingAnimation offset={2} />
        </View>
      ) : (
        <View
          style={{
            backgroundColor: '#f0f0f0',
            padding: 10,
            borderRadius: 10,
            maxWidth: '80%',
            marginLeft: 10,
          }}>
          <Text style={{color: 'black'}}>{message}</Text>
        </View>
      )}
    </View>
  );
};

const MessageBubble: React.FC<{
  message: Message;
  friend: User;
  index: number;
}> = ({message, friend, index}) => {
  const [showTyping, setShowTyping] = React.useState<boolean>(false);

  const messagesTyping = useGlobal(state => state.messagesTyping);

  useEffect(() => {
    if (index !== 0) return;
    if (messagesTyping === null) {
      setShowTyping(false);
      return;
    }
    setShowTyping(true);

    const check = setInterval(() => {
      const now = new Date();
      const ms = now.getTime() - new Date(messagesTyping).getTime();
      if (ms > 5000) {
        setShowTyping(false);
      }
    }, 1000);
    return () => clearInterval(check);
  }, [messagesTyping]);

  if (index === 0) {
    if (showTyping) {
      return (
        <FriendMessageBubble
          message={'Typing...'}
          friend={friend}
          typing={true}
        />
      );
    }
    return;
  }

  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginBottom: 10,
      }}>
      {message.is_my_message ? (
        <MyMessageBubble message={message.content} />
      ) : (
        <FriendMessageBubble message={message.content} friend={friend} />
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
  const preview = route.params.connection;
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
    messageSend(cleanedMessage, preview);
  };

  const onType = (value: string) => {
    setMessage(value);
    if (messageTyping) {
      messageTyping(preview);
    }
  };

  const messagesList = useGlobal(state => state.messagesList);
  const messageList = useGlobal(state => state.messageList);
  const messageSend = useGlobal(state => state.messageSend);
  const messageTyping = useGlobal(state => state.messageTyping);
  const messageNext = useGlobal(state => state.messageNext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: props => <MessageHeader friend={preview.friend} />,
      headerBackTitleVisible: false,
      headerTintColor: 'tomato',
    });
  });

  useEffect(() => {
    messageList(preview);
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

  const connection: Connection = {
    id: preview.id,
    sender: preview.friend,
    receiver: preview.friend,
    created_at: '',
    updated_at: preview.updated_at,
  };

  const typing: Message = {
    id: -1,
    connection: connection,
    sender: preview.friend,
    content: 'Typing...',
    created_at: '',
    is_my_message: false,
  };

  return (
    <SafeAreaView style={{flex: 1}}>
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
            data={[typing, ...messagesList]}
            inverted={true}
            onEndReached={() => {
              if (messageNext > 0) {
                messageList(preview, messageNext);
              }
            }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => (
              <MessageBubble
                message={item}
                friend={preview.friend}
                index={index}
              />
            )}
          />
        </View>
      {Platform.OS === 'ios' ? (
        <InputAccessoryView>
          <MessageInput message={message} setMessage={onType} onSend={onSend} />
        </InputAccessoryView>
      ) : (
        <MessageInput message={message} setMessage={onType} onSend={onSend} />
      )}
    </SafeAreaView>
  );
};

export default MessagesScreen;
