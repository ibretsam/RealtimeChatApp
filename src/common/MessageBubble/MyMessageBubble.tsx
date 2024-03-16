import { useState } from "react";
import useGlobal from "../../core/global";
import ImageView from 'react-native-image-viewing';
import { Text, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import { getImageUrlsAndIndex } from "../../core/utils";

const MyMessageBubble: React.FC<{
  message: string;
  image_url?: string;
  imageSize?: {width: number; height: number};
  imagesList: (string | undefined)[];
}> = ({message, image_url, imageSize, imagesList}) => {
  const [showImage, setShowImage] = useState<boolean>(false);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const images_url = useGlobal(state => state.imagesList);

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
        justifyContent: 'flex-end',
        marginBottom: 5,
      }}>
      <View
        style={{
          backgroundColor: 'tomato',
          padding: image_url ? 0 : 10,
          borderRadius: 10,
          maxWidth: '80%',
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
            color: 'white',
            paddingLeft: image_url ? 5 : 0,
            marginBottom: image_url ? 5 : 0,
          }}>
          {message}
        </Text>
      </View>
    </View>
  );
};

export default MyMessageBubble;