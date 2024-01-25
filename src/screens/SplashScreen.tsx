import {Animated, SafeAreaView, StatusBar} from 'react-native';
import Title from '../common/Title';
import {useEffect, useLayoutEffect} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

type SplashScreenProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const translateY = new Animated.Value(0);
  const DURATION = 800;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 20,
          duration: DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: DURATION,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'tomato',
      }}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={{transform: [{translateY}]}}>
        <Title text="Realtime Chat" color="white" />
      </Animated.View>
    </SafeAreaView>
  );
};

export default SplashScreen;
