import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
	ActivityIndicator,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableWithoutFeedback,
	View,
	StyleSheet
} from 'react-native';
import {RootStackParamList} from '../../App';
import {useLayoutEffect, useState} from 'react';
import Title from '../common/Title';
import Input from '../common/Input';
import Button from '../common/Button';
import {log} from '../core/utils';
import api from '../core/api';
import useGlobal from '../core/global';

type RegisterScreenProps = NativeStackScreenProps<
	RootStackParamList,
	'Register'
>;

const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
	const [firstname, setFirstname] = useState<string>('');
	const [lastname, setLastname] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [confirm, setConfirm] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	const [firstnameError, setFirstNameError] = useState<string>('');
	const [lastnameError, setLastNameError] = useState<string>('');
	const [emailError, setEmailError] = useState<string>('');
	const [usernameError, setUsernameError] = useState<string>('');
	const [passwordError, setPasswordError] = useState<string>('');
	const [confirmError, setConfirmError] = useState<string>('');

	const login = useGlobal(state => state.login);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerShown: false,
			gestureEnabled: true,
			fullScreenGestureEnabled: true,
		});
	}, []);

	const validate = () => {
		if (firstname === '') {
			setFirstNameError('First name is required');
		} else {
			setFirstNameError('');
		}

		if (lastname === '') {
			setLastNameError('Last name is required');
		} else {
			setLastNameError('');
		}

		if (email === '') {
			setEmailError('Email is required');
		} else {
			setEmailError('');
		}

		if (username === '') {
			setUsernameError('Username is required');
		} else {
			setUsernameError('');
		}

		if (password === '') {
			setPasswordError('Password is required');
		} else {
			setPasswordError('');
		}

		if (confirm === '') {
			setConfirmError('Confirm Password is required');
		} else {
			setConfirmError('');
		}

		if (password !== confirm) {
			setConfirmError('Confirm Password must match Password');
		}

		if (
			firstname !== '' &&
			lastname !== '' &&
			email !== '' &&
			username !== '' &&
			password !== '' &&
			confirm !== '' &&
			password === confirm
		) {
			return true;
		} else {
			return false;
		}
	};

	const onRegister = () => {
		log('Register');
		setLoading(true)
		if (validate()) {
			log('Validated');
			api({
				method: 'POST',
				url: '/api/chat/register/',
				data: {
					username,
					password,
					email,
					first_name: firstname,
					last_name: lastname,
				},
			})
				.then(res => {
					log(res.data);
					const user = res.data.user;
					const tokens = res.data.tokens;
					const {access, refresh} = tokens;
					login(access, refresh, user);
				})
				.catch(err => {
					log(err.response)
					log(err.response.data);
					if (err.response.data.username) {
						setUsernameError(err.response.data.username)
					}
					if (err.response.data.email) {
						setUsernameError(err.response.data.email)
					}
				})
				.finally(() => {
					setLoading(false)
				})
		} else {
			log('Not Validated');
			return;
		}
	};

	return (
		<SafeAreaView style={{flex: 1}}>
			{loading && (
					<View
						style={{
							...StyleSheet.absoluteFillObject,
							backgroundColor: 'rgba(0,0,0,0.5)',
							justifyContent: 'center',
							alignItems: 'center',
							zIndex: 1000,
						}}>
						<ActivityIndicator size="large" color="white" />
					</View>
			)}
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={{
					flex: 1,
				}}>
				<TouchableWithoutFeedback
					onPress={() => Keyboard.dismiss()}
					style={{flex: 1}}>
					<ScrollView
						contentContainerStyle={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
						}}>
						<Title text="Register" color="tomato" style={{marginBottom: 30}} />
						<Input
							title="First Name"
							value={firstname}
							setValue={setFirstname}
							error={firstnameError}
							setError={setFirstNameError}
							autoCapitalize="words"
						/>
						<Input
							title="Last Name"
							value={lastname}
							setValue={setLastname}
							error={lastnameError}
							setError={setLastNameError}
							autoCapitalize="words"
						/>
						<Input
							title="Email"
							value={email}
							setValue={setEmail}
							error={emailError}
							setError={setEmailError}
							autoCapitalize="none"
						/>
						<Input
							title="Username"
							value={username}
							setValue={setUsername}
							error={usernameError}
							setError={setUsernameError}
							autoCapitalize="none"
						/>
						<Input
							title="Password"
							value={password}
							setValue={setPassword}
							error={passwordError}
							setError={setPasswordError}
							isPassword={true}
							autoCapitalize="none"
						/>
						<Input
							title="Confirm Password"
							value={confirm}
							setValue={setConfirm}
							error={confirmError}
							setError={setConfirmError}
							isPassword={true}
							autoCapitalize="none"
						/>
						<Button
							text="Register"
							onPress={onRegister}
							style={{marginTop: 15}}
						/>
						<Text style={{marginTop: 15, color: 'gray'}}>
							Already have an account?{' '}
							<Text
								style={{color: 'tomato'}}
								onPress={() => navigation.navigate('Login')}>
								Login
							</Text>
						</Text>
					</ScrollView>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

export default RegisterScreen;
