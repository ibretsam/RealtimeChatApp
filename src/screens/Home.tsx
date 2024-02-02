import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import RequestsScreen from './Requests';
import FriendsScreen from './Friends';
import ProfileScreen from './Profile';
import {RootStackParamList} from '../../App';
import {useEffect, useLayoutEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {Image, TouchableOpacity, View} from 'react-native';
import useGlobal from '../core/global';
import {thumbnail} from '../core/utils';
import Avatar from '../common/Avatar';

type RootTabParamList = {
  Home: undefined;
  Requests: undefined;
  Friends: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

type HomeScreenProps = BottomTabScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const user = useGlobal(state => state.user);

  const socketConnect = useGlobal(state => state.socketConnect);
  const socketDisconnect = useGlobal(state => state.socketDisconnect);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    socketConnect();
    return () => {
      socketDisconnect();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({route, navigation}) => ({
        headerLeft: () => (
          <View style={{marginLeft: 16}}>
            <Avatar src={user?.thumbnail} size={28} />
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity>
            <FontAwesomeIcon
              style={{marginRight: 16}}
              icon="magnifying-glass"
              size={22}
              color="tomato"
            />
          </TouchableOpacity>
        ),
        tabBarIcon: ({focused, color, size}) => {
          const icons = {
            Requests: 'user-plus',
            Friends: 'users',
            Profile: 'user',
          };

          const icon = icons[route.name as keyof typeof icons];

          return (
            <FontAwesomeIcon
              icon={icon as IconProp}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,
      })}>
      <Tab.Screen name="Requests" component={RequestsScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default HomeScreen;
