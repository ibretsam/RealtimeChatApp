/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/Home';
import LoginScreen from './src/screens/Login';
import MessagesScreen from './src/screens/Message';
import SearchScreen from './src/screens/Search';
import RegisterScreen from './src/screens/Register';
import './src/core/font-awesome';
import useGlobal from './src/core/global';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Login: undefined;
  Messages: undefined;
  Search: undefined;
  Register: undefined;
};

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const initialized = useGlobal(state => state.initialized);
  const authenticated = useGlobal(state => state.authenticated);

  const init = useGlobal(state => state.init);

  useEffect(() => {
    init();
  }, []);

  return (
    <NavigationContainer theme={LightTheme}>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator>
        {!initialized ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
          </>
        ) : !authenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Messages" component={MessagesScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
