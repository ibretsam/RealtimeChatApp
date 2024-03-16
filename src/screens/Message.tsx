import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
	ActivityIndicator,
	FlatList,
	InputAccessoryView,
	Platform,
	SafeAreaView,
	View,
} from 'react-native';
import {RootStackParamList} from '../../App';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import useGlobal from '../core/global';
import MessageBubble from '../common/MessageBubble/MessageBubble';
import MessageHeader from '../common/MessageHeader';
import MessageInput from '../common/MessageInput';
import {Asset} from 'react-native-image-picker';

type MessagesScreenProps = NativeStackScreenProps<
	RootStackParamList,
	'Message'
>;

const MessagesScreen: React.FC<MessagesScreenProps> = ({navigation, route}) => {
	const preview = route.params.connection;
	const [message, setMessage] = useState<string>('');
	const [imageSelect, setImageSelect] = useState<Asset | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);

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

	useEffect(() => {
		if (
			messagesList?.length === 0 ||
			messagesList === null ||
			messagesList === undefined
		) {
			setIsLoading(true);
		} else {
			setIsLoading(false);
		}
	}, [messagesList]);

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
				{isLoading ? (
					<View
						style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
						<ActivityIndicator size="large" color="tomato" />
					</View>
				) : (
					<FlatList
						automaticallyAdjustKeyboardInsets={true}
						contentContainerStyle={{
							paddingTop: 30,
						}}
						data={[typing, ...(messagesList || [])]}
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
				)}
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
