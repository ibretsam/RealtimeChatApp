import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
  InputAccessoryView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {RootStackParamList} from '../../App';
import React, {useEffect, useLayoutEffect, useRef} from 'react';
import Avatar from '../common/Avatar';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import useGlobal from '../core/global';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';

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

const MyMessageBubble: React.FC<{message: string; image_url?: string}> = ({
  message,
  image_url,
}) => {
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
        {image_url && (
          <FastImage
            source={{uri: image_url}}
            style={{
              height: 200,
              aspectRatio: 1,
              borderRadius: 10,
              margin: 3,
              marginBottom: 10,
            }}
          />
        )}
        <Text style={{color: 'white'}}>{message}</Text>
      </View>
    </View>
  );
};

const FriendMessageBubble: React.FC<{
  message: string;
  friend: User;
  image_url?: string;
  typing?: boolean;
}> = ({message, friend, image_url, typing = false}) => {
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
          {image_url && (
            <FastImage
              source={{uri: image_url}}
              style={{
                height: 200,
                aspectRatio: 1,
                borderRadius: 10,
                margin: 3,
                marginBottom: 10,
              }}
            />
          )}
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
        <MyMessageBubble
          message={message.content}
          image_url={message.image_url}
        />
      ) : (
        <FriendMessageBubble
          message={message.content}
          friend={friend}
          image_url={message.image_url}
        />
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
  image: Asset | null;
  setImage: (image: Asset | null) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  message,
  setMessage,
  onSend,
  image,
  setImage,
}) => {
  const [disabled, setDisabled] = React.useState<boolean>(true);
  const [imageSelect, setImageSelect] = React.useState<boolean>(false);
  const [parentWidth, setParentWidth] = React.useState<number>(0);

  const onImageSelected = () => {
    console.log('Image selected');
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
      },
      response => {
        if (response.didCancel) return;
        const file = response.assets?.[0];
        if (file) {
          setImageSelect(true);
          setImage(file);
        }
      },
    );
  };

  const handleInput = (text: string) => {
    setMessage(text);
    setDisabled(text.length === 0 && !image);
  };

  useEffect(() => {
    setImageSelect(image !== null);
    setDisabled(message.length === 0 && !image);
  }, [image]);

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
        }}
        onLayout={event => {
          var {width} = event.nativeEvent.layout;
          setParentWidth(width);
        }}>
        {imageSelect && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <TouchableOpacity
              onPress={() => setImageSelect(false)}
              style={{
                position: 'absolute',
                right: 5,
                top: 5,
                backgroundColor: 'white',
                width: 30,
                height: 30,
                borderRadius: 15,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: 'gray',
                zIndex: 100,
              }}>
              <FontAwesomeIcon icon="circle-xmark" size={24} color="gray" />
            </TouchableOpacity>

            <FastImage
              source={{uri: image?.uri}}
              style={{
                height: 200,
                width: image
                  ? Math.min(
                      parentWidth,
                      200 * ((image.width ?? 1) / (image.height ?? 1)),
                    )
                  : 200,
                borderRadius: 10,
                marginRight: 10,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          </View>
        )}
        <TextInput
          placeholder="Type a message"
          value={message}
          onChangeText={handleInput}
          // autoFocus={true}
        />
      </View>
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 5,
          marginRight: 15,
        }}
        onPress={onImageSelected}>
        <FontAwesomeIcon icon="image" size={24} color="gray" />
      </TouchableOpacity>
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
  const [imageSelect, setImageSelect] = React.useState<Asset | null>(null);

  const onSend = () => {
    const cleanedMessage = message.replace(/\s+/g, ' ').trim();
    if (cleanedMessage.length > 0) {
      console.log('Send message:', cleanedMessage);
      setMessage('');
    } else {
      return;
    }
    if (imageSelect) {
      console.log('Send image:', imageSelect);
      setImageSelect(null);
    }
    messageSend(cleanedMessage, imageSelect, preview);
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
      gestureEnabled: true,
      fullScreenGestureEnabled: true,
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
    image_url: undefined,
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
          <MessageInput
            message={message}
            setMessage={onType}
            onSend={onSend}
            image={imageSelect}
            setImage={setImageSelect}
          />
        </InputAccessoryView>
      ) : (
        <MessageInput
          message={message}
          setMessage={onType}
          onSend={onSend}
          image={imageSelect}
          setImage={setImageSelect}
        />
      )}
    </SafeAreaView>
  );
};

export default MessagesScreen;
