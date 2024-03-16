import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

const TypingAnimation: React.FC<{offset: number}> = ({offset}) => {
  const y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const TOTAL = 1000;
    const BUMP = 200;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(BUMP * offset),
        Animated.timing(y, {
          toValue: 1,
          duration: BUMP,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(y, {
          toValue: 0,
          duration: BUMP,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.delay(TOTAL - BUMP * 2 - BUMP * offset),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, []);

  const translateY = y.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <Animated.View
      style={{
        width: 8,
        height: 8,
        marginHorizontal: 2,
        borderRadius: 4,
        backgroundColor: '#606060',
        transform: [{translateY}],
      }}
    />
  );
};

export default TypingAnimation;