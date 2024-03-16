import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useEffect, useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import FastImage from "react-native-fast-image";
import { Asset, launchImageLibrary } from "react-native-image-picker";

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
  const [disabled, setDisabled] = useState<boolean>(true);
  const [imageSelect, setImageSelect] = useState<boolean>(false);
  const [parentWidth, setParentWidth] = useState<number>(0);

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
          let {width} = event.nativeEvent.layout;
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

export default MessageInput;