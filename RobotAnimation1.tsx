import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Animated, 
  Dimensions,
  Easing
} from 'react-native';

const { width } = Dimensions.get('window');

// Define emotion types
type EmotionType = 'lookout' | 'worried' | 'happy' | 'surprised' | 'angry' | 'success' | 'curious';

interface RobotAnimationProps {
  emotion?: EmotionType;
}

const RobotAnimation: React.FC<RobotAnimationProps> = ({ emotion = 'lookout' }) => {
  const [robotEyeAnim] = useState(new Animated.Value(0));
  const [robotBodyAnim] = useState(new Animated.Value(0));
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>(emotion || 'lookout');
  const [leftSoundAnim] = useState(new Animated.Value(0));
  const [rightSoundAnim] = useState(new Animated.Value(0));
  const [isTalking, setIsTalking] = useState(false);

  useEffect(() => {
    // Create looping eye animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(robotEyeAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        }),
        Animated.timing(robotEyeAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        }),
      ])
    ).start();

    // Create subtle body hover animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(robotBodyAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        }),
        Animated.timing(robotBodyAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
          easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (emotion) {
      setCurrentEmotion(emotion);
      return;
    }
    
    // If no emotion is specified, cycle through emotions
    const emotions: EmotionType[] = ['lookout', 'worried', 'happy', 'surprised', 'angry', 'curious'];
    const interval = setInterval(() => {
      setCurrentEmotion(prevEmotion => {
        const currentIndex = emotions.indexOf(prevEmotion);
        const nextIndex = (currentIndex + 1) % emotions.length;
        return emotions[nextIndex];
      });
    }, 5000); // Change emotion every 5 seconds
    
    return () => clearInterval(interval);
  }, [emotion]);

  useEffect(() => {
    // Start talking animation when emotion changes
    setIsTalking(true);
    
    // Create sound wave animations
    const soundAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(leftSoundAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          }),
          Animated.timing(rightSoundAnim, {
            toValue: 0.5,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          }),
        ]),
        Animated.parallel([
          Animated.timing(leftSoundAnim, {
            toValue: 0.5,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          }),
          Animated.timing(rightSoundAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          }),
        ]),
      ]),
      { iterations: 3 } // Talk for 3 cycles
    );
    
    soundAnimation.start(() => {
      // Stop talking after animation completes
      setIsTalking(false);
    });
    
    return () => {
      soundAnimation.stop();
    };
  }, [currentEmotion]); // Run this effect when emotion changes

  // Get eye color based on emotion
  const getEyeColor = () => {
    switch(currentEmotion) {
      case 'happy':
      case 'success':
        return '#4CD964'; // Green for positive emotions
      case 'angry':
      case 'danger':
        return '#FF3B30'; // Red for negative emotions
      default:
        return '#5BCAFF'; // Blue for neutral emotions
    }
  };

  // Render different eye shapes based on emotion
  const renderEyes = () => {
    const eyeColor = getEyeColor();
    
    switch(currentEmotion) {
      case 'worried':
        return (
          <View style={styles.robotFace}>
            <Animated.View 
              style={[
                styles.robotEye,
                styles.worriedEye,
                {
                  backgroundColor: eyeColor,
                  opacity: robotEyeAnim
                }
              ]}
            />
            <Animated.View 
              style={[
                styles.robotEye,
                styles.worriedEye,
                {
                  backgroundColor: eyeColor,
                  opacity: robotEyeAnim
                }
              ]}
            />
          </View>
        );
      case 'happy':
      case 'success':
        return (
          <View style={styles.robotFace}>
            <Animated.View 
              style={[
                styles.robotEye,
                styles.happyEye,
                {
                  backgroundColor: eyeColor,
                  opacity: robotEyeAnim
                }
              ]}
            />
            <Animated.View 
              style={[
                styles.robotEye,
                styles.happyEye,
                {
                  backgroundColor: eyeColor,
                  opacity: robotEyeAnim
                }
              ]}
            />
          </View>
        );
      case 'surprised':
        return (
          <View style={styles.robotFace}>
            <Animated.View 
              style={[
                styles.robotEye,
                styles.surprisedEye,
                {
                  backgroundColor: eyeColor,
                  opacity: robotEyeAnim
                }
              ]}
            />
            <Animated.View 
              style={[
                styles.robotEye,
                styles.surprisedEye,
                {
                  backgroundColor: eyeColor,
                  opacity: robotEyeAnim
                }
              ]}
            />
          </View>
        );
      case 'angry':
        return (
          <View style={styles.robotFace}>
            <Animated.View 
              style={[
                styles.robotEye,
                {
                  backgroundColor: eyeColor,
                  opacity: robotEyeAnim
                }
              ]}
            />
            <Animated.View 
              style={[
                styles.robotEye,
                styles.curiousRightEye,
                {
                  backgroundColor: eyeColor,
                  opacity: robotEyeAnim
                }
              ]}
            />
          </View>
        );
      case 'curious':
        return (
          <View style={styles.robotFace}>
            <Animated.View 
              style={[
                styles.robotEye,
                {
                  backgroundColor: eyeColor,
                  opacity: robotEyeAnim
                }
              ]}
            />
            <Animated.View 
              style={[
                styles.robotEye,
                styles.curiousRightEye,
                {
                  backgroundColor: eyeColor,
                  opacity: robotEyeAnim
                }
              ]}
            />
          </View>
        );
      case 'lookout':
      default:
        return (
          <View style={styles.robotFace}>
            <Animated.View 
              style={[
                styles.robotEye,
                {
                  backgroundColor: eyeColor,
                  opacity: robotEyeAnim
                }
              ]}
            />
            <Animated.View 
              style={[
                styles.robotEye,
                {
                  backgroundColor: eyeColor,
                  opacity: robotEyeAnim
                }
              ]}
            />
          </View>
        );
    }
  };

  return (
    <View style={styles.robotContainer}>
      {isTalking && (
        <>
          <Animated.View 
            style={[
              styles.soundWave,
              styles.leftSoundWave,
              {
                opacity: leftSoundAnim,
                transform: [
                  { scaleY: leftSoundAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1]
                  })}
                ]
              }
            ]}
          />
          <Animated.View 
            style={[
              styles.soundWave,
              styles.rightSoundWave,
              {
                opacity: rightSoundAnim,
                transform: [
                  { scaleY: rightSoundAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1]
                  })}
                ]
              }
            ]}
          />
        </>
      )}
      <Animated.View 
        style={[
          styles.robotBody,
          {
            transform: [
              { translateY: robotBodyAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -5]
              })}
            ]
          }
        ]}
      >
        {renderEyes()}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  robotContainer: {
    position: 'absolute',
    top: 15,
    left: width / 2 - 50,
    zIndex: 10,
  },
  robotBody: {
    width: 74,
    height: 34,
    backgroundColor: '#333333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  robotFace: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  robotEye: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  // Worried eyes (half-moon shape facing up)
  worriedEye: {
    height: 8,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  // Happy eyes (half-moon shape facing down)
  happyEye: {
    height: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  // Surprised eyes (larger circles)
  surprisedEye: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  // Angry eyes (angled rectangles)
  angryEye: {
    height: 8,
    width: 16,
    borderRadius: 4,
    transform: [{ rotate: '-15deg' }],
  },
  // Curious eyes (one normal, one minus sign)
  curiousLeftEye: {
    // Using default robotEye style for the left eye
  },
  curiousRightEye: {
    width: 16,
    height: 4, // Thin horizontal line
    borderRadius: 2, // Rounded ends
    transform: [{ translateY: 6 }], // Center vertically (16px eye height / 2 - 4px line height / 2 = 6)
  },
  soundWave: {
    position: 'absolute',
    width: 2,
    height: 12,
    backgroundColor: '#5BCAFF',
    borderRadius: 1,
  },
  leftSoundWave: {
    left: -10,
    top: 12,
  },
  rightSoundWave: {
    right: -10,
    top: 12,
  },
});

export default RobotAnimation; 