import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Animated, 
  Dimensions,
  Easing,
  TouchableWithoutFeedback,
  StatusBar,
  Platform,
  PanResponder,
  Text,
  Image
} from 'react-native';

const { width, height } = Dimensions.get('window');

type IslandState = 'default' | 'expanded' | 'minimized';
type NotificationType = 'incoming-call' | 'music' | 'timer' | 'notification' | 'whatsapp' | 'message';
type AppIconType = 'phone' | 'message' | 'whatsapp' | 'music' | 'none';

interface DynamicIslandProps {
  onPress?: () => void;
  onLongPress?: () => void;
}

const DynamicIsland: React.FC<DynamicIslandProps> = ({ onPress, onLongPress }) => {
  // State management
  const [state, setState] = useState<IslandState>('default');
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [activeIcons, setActiveIcons] = useState<AppIconType[]>([]);
  
  // Animation refs
  const expandAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const positionAnim = useRef(new Animated.Value(0)).current;
  const contentOpacityAnim = useRef(new Animated.Value(0)).current;
  const verticalPosition = useRef(new Animated.Value(
    (Platform.OS === 'android' ? StatusBar.currentHeight || 30 : 30) + 10
  )).current;
  const lockAnim = useRef(new Animated.Value(0)).current;

  // Store the locked position value
  const lockedPositionRef = useRef<number | null>(null);

  // Dimensions
  const defaultWidth = 120;
  const defaultHeight = 35;
  const expandedWidth = width - 40;
  const expandedHeight = 150;

  // Pan responder for drag and lock functionality
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isLocked, // Don't respond if locked
      onMoveShouldSetPanResponder: () => !isLocked, // Don't respond if locked
      onPanResponderMove: (_, gestureState) => {
        if (isLocked) return; // Don't move if locked
        
        const newPosition = (StatusBar.currentHeight || 30) + 10 + gestureState.dy;
        if (newPosition >= 0 && newPosition <= height * 0.7) {
          verticalPosition.setValue(newPosition);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isLocked) return; // Don't respond if locked
        
        if (gestureState.dy === 0) {
          // Tap handling
          if (state === 'default') {
            showNotification('music');
          } else if (state === 'expanded') {
            setState('minimized');
          }
          return;
        }

        // Check if this was a long press (duration > 500ms)
        if (gestureState.numberActiveTouches === 0 && gestureState.dy !== 0) {
          // This will be handled by onLongPress
        }
      },
      onPanResponderTerminate: () => {
        if (isLocked && lockedPositionRef.current) {
          verticalPosition.setValue(lockedPositionRef.current);
        }
      }
    })
  ).current;

  // Toggle position lock
  const toggleLockPosition = () => {
    if (isLocked) {
      // Unlock
      setIsLocked(false);
      Animated.timing(lockAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false
      }).start();
    } else {
      // Lock
      setIsLocked(true);
      // Store the current position
      lockedPositionRef.current = verticalPosition._value;
      Animated.timing(lockAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false
      }).start();
    }
  };

  // Show notification with app icon
  const showNotification = (type: NotificationType) => {
    if (isLocked) return; // Don't respond if locked
    
    setNotification(type);
    setState('expanded');
    
    // Add app icon to active icons if not already present
    let icon: AppIconType = 'none';
    switch(type) {
      case 'incoming-call': icon = 'phone'; break;
      case 'message': icon = 'message'; break;
      case 'whatsapp': icon = 'whatsapp'; break;
      case 'music': icon = 'music'; break;
      default: icon = 'none';
    }
    
    if (icon !== 'none' && !activeIcons.includes(icon)) {
      setActiveIcons([...activeIcons, icon]);
    }

    setTimeout(() => {
      setState('minimized');
    }, 5000);
  };

  // Handle state changes
  useEffect(() => {
    switch (state) {
      case 'default':
        Animated.parallel([
          Animated.timing(expandAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: false,
            easing: Easing.out(Easing.ease)
          }),
          Animated.timing(contentOpacityAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false
          })
        ]).start();
        break;
        
      case 'expanded':
        Animated.parallel([
          Animated.timing(expandAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: false,
            easing: Easing.out(Easing.ease)
          }),
          Animated.timing(contentOpacityAnim, {
            toValue: 1,
            duration: 400,
            delay: 200,
            useNativeDriver: false
          })
        ]).start();
        break;
        
      case 'minimized':
        Animated.sequence([
          Animated.timing(positionAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false
          })
        ]).start(() => {
          setState('default');
          setNotification(null);
          opacityAnim.setValue(1);
          positionAnim.setValue(0);
        });
        break;
    }
  }, [state]);

  // Interpolated values
  const islandWidth = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [defaultWidth, expandedWidth]
  });

  const islandHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [defaultHeight, expandedHeight]
  });

  const borderRadius = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [defaultHeight / 2, 20]
  });

  const marginTop = positionAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-53, -100]
  });

  const lockIndicatorOpacity = lockAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  // Render app icons in default state
  const renderAppIcons = () => {
    if (activeIcons.length === 0 || state !== 'default') return null;

    return (
      <View style={styles.appIconsContainer}>
        {activeIcons.map((icon, index) => (
          <View key={index} style={styles.appIcon}>
            {icon === 'phone' && <Text style={styles.iconText}>📞</Text>}
            {icon === 'message' && <Text style={styles.iconText}>✉️</Text>}
            {icon === 'whatsapp' && <Text style={styles.iconText}>💬</Text>}
            {icon === 'music' && <Text style={styles.iconText}>🎵</Text>}
          </View>
        ))}
      </View>
    );
  };

  // Render notification content
  const renderContent = () => {
    if (!notification) return null;

    switch (notification) {
      case 'incoming-call':
        return (
          <Animated.View style={[styles.content, { opacity: contentOpacityAnim }]}>
            <View style={styles.callContainer}>
              <View style={styles.callIcon}>
                <Text style={styles.largeIcon}>📞</Text>
              </View>
              <View style={styles.callInfo}>
                <Text style={styles.callTitle}>Incoming Call</Text>
                <Text style={styles.callSubtitle}>John Doe</Text>
              </View>
              <View style={styles.callActions}>
                <TouchableWithoutFeedback>
                  <View style={[styles.callButton, styles.declineButton]}>
                    <Text style={styles.buttonText}>Decline</Text>
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                  <View style={[styles.callButton, styles.acceptButton]}>
                    <Text style={styles.buttonText}>Accept</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </Animated.View>
        );
        
      case 'music':
        return (
          <Animated.View style={[styles.content, { opacity: contentOpacityAnim }]}>
            <View style={styles.musicContainer}>
              <View style={styles.albumArt}>
                <Text style={styles.largeIcon}>🎵</Text>
              </View>
              <View style={styles.musicInfo}>
                <Text style={styles.musicTitle}>Current Song</Text>
                <Text style={styles.musicArtist}>Artist Name</Text>
              </View>
              <View style={styles.musicControls}>
                <TouchableWithoutFeedback>
                  <Text style={styles.controlIcon}>⏮</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                  <Text style={styles.controlIcon}>⏯</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                  <Text style={styles.controlIcon}>⏭</Text>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </Animated.View>
        );
        
      case 'whatsapp':
        return (
          <Animated.View style={[styles.content, { opacity: contentOpacityAnim }]}>
            <View style={styles.messageContainer}>
              <View style={styles.messageIcon}>
                <Text style={styles.largeIcon}>💬</Text>
              </View>
              <View style={styles.messageInfo}>
                <Text style={styles.messageTitle}>WhatsApp</Text>
                <Text style={styles.messageText}>New message from Sarah</Text>
              </View>
            </View>
          </Animated.View>
        );
        
      case 'message':
        return (
          <Animated.View style={[styles.content, { opacity: contentOpacityAnim }]}>
            <View style={styles.messageContainer}>
              <View style={styles.messageIcon}>
                <Text style={styles.largeIcon}>✉️</Text>
              </View>
              <View style={styles.messageInfo}>
                <Text style={styles.messageTitle}>New Message</Text>
                <Text style={styles.messageText}>You have 3 new messages</Text>
              </View>
            </View>
          </Animated.View>
        );
        
      default:
        return (
          <Animated.View style={[styles.content, { opacity: contentOpacityAnim }]}>
            <View style={styles.notificationContainer}>
              <View style={styles.notificationIcon}>
                <Text style={styles.largeIcon}>🔔</Text>
              </View>
              <View style={styles.notificationText}>
                <Text style={styles.notificationTitle}>Notification</Text>
                <Text style={styles.notificationMessage}>You have new notifications</Text>
              </View>
            </View>
          </Animated.View>
        );
    }
  };

  return (
    <>
      <Animated.View 
        style={[
          styles.container,
          {
            width: islandWidth,
            height: islandHeight,
            borderRadius,
            opacity: opacityAnim,
            marginTop,
            top: isLocked ? lockedPositionRef.current : verticalPosition
          }
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableWithoutFeedback 
          onPress={() => {
            if (isLocked) return;
            if (state === 'default') showNotification('notification');
            else if (state === 'expanded') setState('minimized');
          }}
          onLongPress={toggleLockPosition}
        >
          <View style={styles.touchArea}>
            {state === 'default' && (
              <>
                <View style={styles.defaultIndicators}>
                  {activeIcons.length > 0 ? renderAppIcons() : (
                    <>
                      <View style={styles.indicatorDot} />
                      <View style={styles.indicatorDot} />
                      <View style={styles.indicatorDot} />
                    </>
                  )}
                </View>
                <Animated.View style={[styles.lockIndicator, { opacity: lockIndicatorOpacity }]}>
                  <Text style={styles.lockText}>{isLocked ? '🔒 Position Locked' : '🔓 Position Unlocked'}</Text>
                </Animated.View>
              </>
            )}
            {renderContent()}
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    overflow: 'hidden',
    zIndex: 1000,
  },
  touchArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  indicatorDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    marginHorizontal: 2,
  },
  content: {
    width: '100%',
    height: '100%',
    padding: 15,
  },
  appIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIcon: {
    marginHorizontal: 5,
  },
  iconText: {
    fontSize: 16,
  },
  largeIcon: {
    fontSize: 24,
  },
  lockIndicator: {
    position: 'absolute',
    bottom: 5,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  lockText: {
    color: 'white',
    fontSize: 10,
  },
  // Call styles
  callContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  callIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callInfo: {
    flex: 1,
    marginHorizontal: 15,
  },
  callTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  callSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  callActions: {
    flexDirection: 'row',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  declineButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.7)',
  },
  acceptButton: {
    backgroundColor: 'rgba(52, 199, 89, 0.7)',
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
  },
  // Music styles
  musicContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  albumArt: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  musicInfo: {
    flex: 1,
    marginHorizontal: 15,
  },
  musicTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  musicArtist: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  musicControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlIcon: {
    fontSize: 24,
    color: 'white',
    marginHorizontal: 12,
  },
  // Message styles
  messageContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageInfo: {
    flex: 1,
    marginLeft: 15,
  },
  messageTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  messageText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  // Notification styles
  notificationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    flex: 1,
    marginLeft: 15,
  },
  notificationTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationMessage: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
});

export default DynamicIsland;