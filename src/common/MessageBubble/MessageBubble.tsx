import { useEffect, useState } from "react";
import useGlobal from "../../core/global";
import { Image, View } from "react-native";
import FriendMessageBubble from "./FriendMessageBubble";
import MyMessageBubble from "./MyMessageBubble";

const MessageBubble: React.FC<{
  message: Message;
  friend: User;
  index: number;
}> = ({message, friend, index}) => {
  const [showTyping, setShowTyping] = useState<boolean>(false);
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const imagesList = useGlobal(state => state.messagesList ?? [])
    .filter(message => message.image_url !== undefined)
    .map(message => message.image_url);

  useEffect(() => {
    if (message.image_url) {
      Image.getSize(message.image_url, (width, height) => {
        let newWidth, newHeight;

        if (height > width) {
          newHeight = 200;
          newWidth = (width / height) * 200;
        } else {
          newWidth = 200;
          newHeight = (height / width) * newWidth;
        }

        setImageSize({width: newWidth, height: newHeight});
      });
    }
  }, [message.image_url]);

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
          imageSize={imageSize as {width: number; height: number} | undefined}
          imagesList={imagesList}
        />
      ) : (
        <FriendMessageBubble
          message={message.content}
          friend={friend}
          image_url={message.image_url}
          imageSize={imageSize as {width: number; height: number} | undefined}
          imagesList={imagesList}
        />
      )}
    </View>
  );
};

export default MessageBubble;