import { Text, View } from "react-native";
import Avatar from "./Avatar";

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

export default MessageHeader;