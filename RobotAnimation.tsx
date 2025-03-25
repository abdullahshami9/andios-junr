import React, { useState, useEffect, useRef } from 'react';
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
  autoTransition?: boolean;
  transitionDuration?: number;
  reactToHumanEmotion?: boolean;
}

const RobotAnimation: React.FC<RobotAnimationProps> = ({ 
  emotion,
  autoTransition = true,
  transitionDuration = 5000,
  reactToHumanEmotion = false
}) => {
  const [robotEyeAnim] = useState(new Animated.Value(0));
  const [robotBodyAnim] = useState(new Animated.Value(0));
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>(emotion || 'lookout');
  const [leftSoundAnim] = useState(new Animated.Value(0));
  const [rightSoundAnim] = useState(new Animated.Value(0));
  const [isTalking, setIsTalking] = useState(false);
  
  // Animation references to control them
  const eyeAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const bodyAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  const soundAnimRef = useRef<Animated.CompositeAnimation | null>(null);
  
  // For emotion transitions with opacity
  const [nextEmotion, setNextEmotion] = useState<EmotionType | null>(null);
  const [emotionTransition] = useState(new Animated.Value(1));
  
  // For simulating human emotion detection
  const humanEmotionDetectorRef = useRef<NodeJS.Timeout | null>(null);

  // Setup basic animations for eyes and body
  useEffect(() => {
    // Create looping eye animation
    eyeAnimRef.current = Animated.loop(
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
    );
    
    eyeAnimRef.current.start();

    // Create subtle body hover animation
    bodyAnimRef.current = Animated.loop(
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
    );
    
    bodyAnimRef.current.start();
    
    return () => {
      if (eyeAnimRef.current) eyeAnimRef.current.stop();
      if (bodyAnimRef.current) bodyAnimRef.current.stop();
    };
  }, []);

  // Handle emotion transitions
  useEffect(() => {
    if (emotion) {
      // If emotion prop is provided, use it
      transitionToEmotion(emotion);
      return;
    } else if (autoTransition) {
      // Auto cycle through emotions if enabled
      const emotions: EmotionType[] = ['lookout', 'worried', 'happy', 'surprised', 'angry', 'curious', 'success'];
      const interval = setInterval(() => {
        const currentIndex = emotions.indexOf(currentEmotion);
        const nextIndex = (currentIndex + 1) % emotions.length;
        transitionToEmotion(emotions[nextIndex]);
      }, transitionDuration);
      
      return () => clearInterval(interval);
    }
  }, [emotion, currentEmotion, autoTransition, transitionDuration]);

  // Simulate human emotion detection
  useEffect(() => {
    if (reactToHumanEmotion && !emotion) {
      // Simulate detecting human emotions at random intervals
      const simulateHumanEmotionDetection = () => {
        const humanEmotions = [
          { human: 'smiling', robot: 'happy' },
          { human: 'frowning', robot: 'worried' },
          { human: 'surprised', robot: 'surprised' },
          { human: 'neutral', robot: 'lookout' },
          { human: 'angry', robot: 'angry' },
          { human: 'interested', robot: 'curious' },
          { human: 'accomplished', robot: 'success' }
        ];
        
        const randomEmotion = humanEmotions[Math.floor(Math.random() * humanEmotions.length)];
        console.log(`Detected human emotion: ${randomEmotion.human}, robot reacting with: ${randomEmotion.robot}`);
        transitionToEmotion(randomEmotion.robot as EmotionType);
        
        // Schedule next emotion detection
        const randomDelay = 3000 + Math.random() * 5000; // Random delay between 3-8 seconds
        humanEmotionDetectorRef.current = setTimeout(simulateHumanEmotionDetection, randomDelay);
      };
      
      // Start the simulation
      humanEmotionDetectorRef.current = setTimeout(simulateHumanEmotionDetection, 2000);
      
      return () => {
        if (humanEmotionDetectorRef.current) {
          clearTimeout(humanEmotionDetectorRef.current);
        }
      };
    }
  }, [reactToHumanEmotion, emotion]);

  // Smooth transition between emotions
  const transitionToEmotion = (newEmotion: EmotionType) => {
    if (newEmotion === currentEmotion) return;
    
    setNextEmotion(newEmotion);
    
    // Fade out current emotion
    Animated.timing(emotionTransition, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start(() => {
      // Update current emotion
      setCurrentEmotion(newEmotion);
      setNextEmotion(null);
      
      // Fade in new emotion
      Animated.timing(emotionTransition, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }).start();
      
      // Trigger talking animation
      startTalking();
    });
  };

  // Control the talking animation
  const startTalking = () => {
    setIsTalking(true);
    
    // Stop previous sound animation if running
    if (soundAnimRef.current) {
      soundAnimRef.current.stop();
    }
    
    // Create sound wave animations
    soundAnimRef.current = Animated.loop(
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
    
    soundAnimRef.current.start(() => {
      // Stop talking after animation completes
      setIsTalking(false);
    });
  };

  // Get eye color based on emotion
  const getEyeColor = (emotion: EmotionType) => {
    switch(emotion) {
      case 'happy':
      case 'success':
        return '#4CD964'; // Green for positive emotions
      case 'angry':
        return '#FF3B30'; // Red for negative emotions
      case 'worried':
        return '#FF9500'; // Orange for cautious emotions
      case 'surprised':
        return '#FF2D55'; // Pink for shocked emotions
      case 'curious':
        return '#AF52DE'; // Purple for inquisitive emotions
      default:
        return '#5BCAFF'; // Blue for neutral emotions
    }
  };

  // Render different eye shapes based on emotion
  const renderEyes = (emotion: EmotionType, opacity: Animated.AnimatedInterpolation<number> = robotEyeAnim) => {
    const eyeColor = getEyeColor(emotion);
    
    switch(emotion) {
      case 'worried':
        return (
          <View style={styles.robotFace}>
            <Animated.View 
              style={[
                styles.robotEye,
                styles.worriedEye,
                {
                  backgroundColor: eyeColor,
                  opacity
                }
              ]}
            />
            <Animated.View 
              style={[
                styles.robotEye,
                styles.worriedEye,
                {
                  backgroundColor: eyeColor,
                  opacity
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
                  opacity
                }
              ]}
            />
            <Animated.View 
              style={[
                styles.robotEye,
                styles.happyEye,
                {
                  backgroundColor: eyeColor,
                  opacity
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
                  opacity
                }
              ]}
            />
            <Animated.View 
              style={[
                styles.robotEye,
                styles.surprisedEye,
                {
                  backgroundColor: eyeColor,
                  opacity
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
                styles.angryEye,
                {
                  backgroundColor: eyeColor,
                  opacity
                }
              ]}
            />
            <Animated.View 
              style={[
                styles.robotEye,
                styles.angryEye,
                {
                  backgroundColor: eyeColor,
                  opacity
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
                  opacity
                }
              ]}
            />
            <Animated.View 
              style={[
                styles.robotEye,
                styles.curiousRightEye,
                {
                  backgroundColor: eyeColor,
                  opacity
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
                  opacity
                }
              ]}
            />
            <Animated.View 
              style={[
                styles.robotEye,
                {
                  backgroundColor: eyeColor,
                  opacity
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
        {/* Current emotion with fade in/out */}
        <Animated.View style={{ opacity: emotionTransition, position: 'absolute' }}>
          {renderEyes(currentEmotion)}
        </Animated.View>
        
        {/* Next emotion for smooth transition */}
        {nextEmotion && (
          <Animated.View style={{ opacity: Animated.subtract(1, emotionTransition), position: 'absolute' }}>
            {renderEyes(nextEmotion)}
          </Animated.View>
        )}
      </Animated.View>
      
      {/* Emotion indicator for debugging */}
      {__DEV__ && (
        <View style={styles.debugInfo}>
          <View style={[styles.debugDot, { backgroundColor: getEyeColor(currentEmotion) }]} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  robotContainer: {
    position: 'absolute',
    top: 5,
    left: width / 2 - 37,
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
  debugInfo: {
    position: 'absolute',
    bottom: -15,
    left: '50%',
    transform: [{ translateX: -5 }],
  },
  debugDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  }
});

export default RobotAnimation;