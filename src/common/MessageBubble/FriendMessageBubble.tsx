import { useState } from "react";
import useGlobal from "../../core/global";
import { Text, TouchableOpacity, View } from "react-native";
import Avatar from "../Avatar";
import TypingAnimation from "../TypingAnimation";
import FastImage from "react-native-fast-image";
import ImageView from 'react-native-image-viewing';
import { getImageUrlsAndIndex } from "../../core/utils";

const FriendMessageBubble: React.FC<{
  message: string;
  friend: User;
  image_url?: string;
  typing?: boolean;
  imageSize?: {width: number; height: number};
  imagesList?: (string | undefined)[];
}> = ({message, friend, image_url, typing = false, imageSize, imagesList}) => {
  const images_url = useGlobal(state => state.imagesList);
  const [showImage, setShowImage] = useState<boolean>(false);
  const [imageIndex, setImageIndex] = useState<number>(0);

  const OnImagePress = (currentImageUrl: string) => {
    console.log('Image pressed');
    console.log('Current image url:', currentImageUrl);
    const {imageIndex} = getImageUrlsAndIndex(
      currentImageUrl,
      imagesList || [],
    );
    setShowImage(true);
    setImageIndex(imageIndex);
  };

  if (showImage) {
    return (
      <ImageView
        images={images_url ? images_url.map(url => ({uri: url})) : []}
        imageIndex={imageIndex}
        visible={showImage}
        onRequestClose={() => setShowImage(false)}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
      />
    );
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 5,
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
            padding: image_url ? 0 : 5,
            borderRadius: 10,
            maxWidth: '80%',
            marginLeft: 10,
            justifyContent: 'center',
          }}>
          {image_url && (
            <TouchableOpacity onPress={() => OnImagePress(image_url)}>
              <FastImage
                source={{uri: image_url}}
                style={{
                  height: imageSize?.height,
                  width: imageSize?.width,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  margin: 2,
                  marginBottom: 5,
                }}
              />
            </TouchableOpacity>
          )}
          <Text
            style={{
              color: 'black',
              paddingLeft: image_url ? 5 : 0,
              marginBottom: image_url ? 5 : 0,
            }}>
            {message}
          </Text>
        </View>
      )}
    </View>
  );
};

export default FriendMessageBubble;