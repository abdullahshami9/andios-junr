import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  Appearance, 
  Animated,
  Dimensions,
  StatusBar,
  FlatList,
  Image,
  Modal,
  Switch,
  Pressable,
  SafeAreaView
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import SQLite from 'react-native-sqlite-storage';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

// Mock data for app grid with proper icons
const MOCK_APPS = [
  { id: '1', name: 'Messages', icon: require('./assets/icons/messages.png'), locked: false },
  { id: '2', name: 'Photos', icon: require('./assets/icons/photos.png'), locked: true },
  { id: '3', name: 'Camera', icon: require('./assets/icons/camera.png'), locked: false },
  { id: '4', name: 'Maps', icon: require('./assets/icons/maps.png'), locked: true },
  { id: '5', name: 'Calendar', icon: require('./assets/icons/calendar.png'), locked: false },
  { id: '6', name: 'Clock', icon: require('./assets/icons/clock.png'), locked: false },
  { id: '7', name: 'Weather', icon: require('./assets/icons/weather.png'), locked: false },
  { id: '8', name: 'Notes', icon: require('./assets/icons/notes.png'), locked: true },
  { id: '9', name: 'Settings', icon: require('./assets/icons/settings.png'), locked: false },
  { id: '10', name: 'Music', icon: require('./assets/icons/music.png'), locked: false },
  { id: '11', name: 'Files', icon: require('./assets/icons/files.png'), locked: true },
  { id: '12', name: 'Store', icon: require('./assets/icons/store.png'), locked: false },
];

// Mock notifications with icons
const MOCK_NOTIFICATIONS = [
  { 
    id: '1', 
    title: 'New Message', 
    content: 'John: Hey, how are you doing?', 
    app: 'Messages', 
    time: '2 min ago', 
    read: false,
    icon: require('./assets/icons/messages.png')
  },
  { 
    id: '2', 
    title: 'Calendar Reminder', 
    content: 'Meeting with design team at 3:00 PM', 
    app: 'Calendar', 
    time: '15 min ago', 
    read: false,
    icon: require('./assets/icons/calendar.png')
  },
  { 
    id: '3', 
    title: 'Weather Alert', 
    content: 'Heavy rain expected in your area', 
    app: 'Weather', 
    time: '30 min ago', 
    read: true,
    icon: require('./assets/icons/weather.png')
  },
  { 
    id: '4', 
    title: 'New Email', 
    content: 'Project update from Sarah', 
    app: 'Mail', 
    time: '1 hour ago', 
    read: true,
    icon: require('./assets/icons/mail.png')
  },
];

const LockScreen = ({ setIsLocked }: { setIsLocked: (locked: boolean) => void }) => {
  const [lockPassword, setLockPassword] = useState('');
  const [db, setDb] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('notification'); // 'notification', 'apps', 'unlock'
  const [passwordError, setPasswordError] = useState('');
  const [userData, setUserData] = useState([]);
  const [apps, setApps] = useState(MOCK_APPS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [selectedApp, setSelectedApp] = useState(null);
  const [appSettingsVisible, setAppSettingsVisible] = useState(false);
  const [expandedNotification, setExpandedNotification] = useState(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const appsGridAnim = useRef(new Animated.Value(0)).current;
  const dynamicIslandAnim = useRef(new Animated.Value(0)).current;
  const notificationExpandAnim = useRef(new Animated.Value(0)).current;
  
  const colorScheme = Appearance.getColorScheme();
  const isDarkMode = colorScheme === 'dark';

  // Add state for real-time notifications
  const [realtimeNotification, setRealtimeNotification] = useState(null);
  const [islandExpanded, setIslandExpanded] = useState(false);
  const islandExpandAnim = useRef(new Animated.Value(0)).current;
  
  // Simulate real-time notifications
  useEffect(() => {
    const notificationInterval = setInterval(() => {
      const randomNotifications = [
        { 
          id: Date.now().toString(), 
          title: 'New Message', 
          content: 'Sarah: Are we still meeting today?', 
          app: 'Messages', 
          time: 'Just now', 
          read: false,
          icon: require('./assets/icons/messages.png')
        },
        { 
          id: Date.now().toString(), 
          title: 'Instagram', 
          content: 'Alex liked your photo', 
          app: 'Instagram', 
          time: 'Just now', 
          read: false,
          icon: require('./assets/icons/instagram.png')
        },
        { 
          id: Date.now().toString(), 
          title: 'Battery Low', 
          content: 'Your battery is below 20%', 
          app: 'System', 
          time: 'Just now', 
          read: false,
          icon: require('./assets/icons/battery.png')
        },
        { 
          id: Date.now().toString(), 
          title: 'Weather Update', 
          content: 'Temperature dropping to 65°F tonight', 
          app: 'Weather', 
          time: 'Just now', 
          read: false,
          icon: require('./assets/icons/weather.png')
        }
      ];
      
      const newNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
      setRealtimeNotification(newNotification);
      
      // Add to notifications list
      setNotifications(prev => [newNotification, ...prev]);
      
      // Animate the dynamic island
      showDynamicIslandNotification(newNotification);
      
    }, 15000); // New notification every 15 seconds
    
    return () => clearInterval(notificationInterval);
  }, []);
  
  const showDynamicIslandNotification = (notification) => {
    // Expand the dynamic island
    setIslandExpanded(true);
    Animated.sequence([
      Animated.timing(islandExpandAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.delay(3000),
      Animated.timing(islandExpandAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start(() => {
      setIslandExpanded(false);
    });
  };

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(dynamicIslandAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
    
    SQLite.openDatabase(
      { name: 'AppLockDB', location: 'default' },
      (database) => {
        setDb(database);
        fetchUserData(database);
      },
      (error) => {
        console.error('Database open error:', error);
      }
    );
  }, []);

  const fetchUserData = (database) => {
    database.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM users',
        [],
        (_, results) => {
          if (results.rows.length > 0) {
            const data = [];
            for (let i = 0; i < results.rows.length; i++) {
              data.push(results.rows.item(i));
            }
            setUserData(data);
          }
        },
        (_, error) => {
          console.error('Error fetching data:', error);
        }
      );
    });
  };

  const unlockApp = () => {
    if (!lockPassword) {
      setPasswordError('Please enter your password');
      return;
    }
    
    if (lockPassword === '1234') {
      // Success animation
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => {
        setCurrentScreen('notification');
        // Animate the apps grid
        Animated.stagger(100, 
          [...Array(MOCK_APPS.length)].map((_, i) => 
            Animated.spring(appsGridAnim, {
              toValue: 1,
              friction: 8,
              tension: 40,
              useNativeDriver: true,
            })
          )
        ).start();
      });
    } else {
      setPasswordError('Incorrect password');
      // Shake animation for error
      Animated.sequence([
        Animated.timing(slideAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 50, useNativeDriver: true })
      ]).start();
    }
  };

  const toggleAppLock = (appId) => {
    setApps(apps.map(app => 
      app.id === appId ? { ...app, locked: !app.locked } : app
    ));
  };

  const openAppSettings = (app) => {
    setSelectedApp(app);
    setAppSettingsVisible(true);
  };

  const expandNotification = (notification) => {
    setExpandedNotification(notification);
    Animated.timing(notificationExpandAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const collapseNotification = () => {
    Animated.timing(notificationExpandAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setExpandedNotification(null);
    });
  };

  const renderAppItem = ({ item, index }) => {
    const animationDelay = index * 50;
    
    return (
      <Animated.View
        style={[
          styles.appItem,
          {
            opacity: appsGridAnim,
            transform: [
              { scale: appsGridAnim },
              { translateY: appsGridAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })}
            ]
          }
        ]}
      >
        <View style={styles.appItemContainer}>
          <TouchableOpacity 
            style={styles.appButton}
            onPress={() => Alert.alert('App Launch', `Opening ${item.name}${item.locked ? ' (Locked)' : ''}`)}
          >
            <Image source={item.icon} style={styles.appIcon} />
            {item.locked && (
              <View style={styles.lockIconContainer}>
                <Icon name="lock" size={14} color="#FFFFFF" />
              </View>
            )}
            <Text style={[styles.appName, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
              {item.name}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.appMenuButton}
            onPress={() => openAppSettings(item)}
          >
            <Icon name="more-vert" size={18} color={isDarkMode ? '#BBBBBB' : '#666666'} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const renderNotificationItem = ({ item }) => {
    const isExpanded = expandedNotification === item.id;
    
    const expandNotification = (notification) => {
      setExpandedNotification(notification.id);
      Animated.timing(notificationExpandAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false
      }).start();
    };
    
    const collapseNotification = () => {
      Animated.timing(notificationExpandAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false
      }).start(() => {
        setExpandedNotification(null);
      });
    };
    
    return (
      <TouchableOpacity 
        style={[
          styles.notificationItem, 
          { 
            backgroundColor: isDarkMode 
              ? item.read ? 'rgba(30, 30, 50, 0.6)' : 'rgba(30, 30, 50, 0.8)' 
              : item.read ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.9)',
          }
        ]}
        onPress={() => isExpanded ? collapseNotification() : expandNotification(item)}
      >
        <View style={styles.notificationHeader}>
          <View style={styles.notificationTitleContainer}>
            <Image source={item.icon} style={styles.notificationListIcon} />
            <Text style={[styles.notificationTitle, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
              {item.title}
            </Text>
          </View>
          <Text style={[styles.notificationTime, { color: isDarkMode ? '#BBBBBB' : '#666666' }]}>
            {item.time}
          </Text>
        </View>
        
        <Text 
          style={[
            styles.notificationContent, 
            { 
              color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
              height: isExpanded ? 'auto' : 20,
            }
          ]}
          numberOfLines={isExpanded ? undefined : 1}
        >
          {item.content}
        </Text>
        
        {isExpanded && (
          <View style={styles.notificationActions}>
            <TouchableOpacity style={styles.notificationAction}>
              <Text style={[styles.actionText, { color: isDarkMode ? '#8E54E9' : '#4776E6' }]}>
                Reply
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationAction}>
              <Text style={[styles.actionText, { color: isDarkMode ? '#8E54E9' : '#4776E6' }]}>
                Mark as Read
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderDynamicIsland = () => {
    const unreadCount = notifications.filter(n => !n.read).length;
    
    const islandWidth = islandExpandAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [width * 0.4, width * 0.9]
    });
    
    const islandHeight = islandExpandAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [40, 80]
    });
    
    return (
      <Animated.View 
        style={[
          styles.dynamicIsland,
          {
            width: islandWidth,
            height: islandHeight,
            transform: [
              { translateY: dynamicIslandAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0]
              })}
            ]
          }
        ]}
      >
        <LinearGradient
          colors={isDarkMode ? ['#2D3748', '#1A202C'] : ['#FFFFFF', '#F7FAFC']}
          style={styles.dynamicIslandGradient}
        >
          {islandExpanded && realtimeNotification ? (
            <View style={styles.expandedIslandContent}>
              <View style={styles.notificationIconContainer}>
                <Image source={realtimeNotification.icon} style={styles.notificationIcon} />
              </View>
              <View style={styles.notificationTextContainer}>
                <Text style={[styles.notificationTitle, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
                  {realtimeNotification.title}
                </Text>
                <Text 
                  style={[styles.notificationContent, { color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)' }]}
                  numberOfLines={1}
                >
                  {realtimeNotification.content}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.closeNotificationButton}
                onPress={() => {
                  Animated.timing(islandExpandAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true
                  }).start(() => {
                    setIslandExpanded(false);
                  });
                }}
              >
                <Icon name="close" size={20} color={isDarkMode ? '#FFFFFF' : '#333333'} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.dynamicIslandContent}>
              <View style={styles.dynamicIslandLeft}>
                <Icon name="notifications" size={24} color={isDarkMode ? '#FFFFFF' : '#333333'} />
                <Text style={[styles.dynamicIslandText, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
                  {unreadCount > 0 ? `${unreadCount} new` : 'No new'}
                </Text>
              </View>
              
              <View style={styles.dynamicIslandRight}>
                <TouchableOpacity 
                  style={styles.dynamicIslandButton}
                  onPress={() => setCurrentScreen('apps')}
                >
                  <Icon name="apps" size={24} color={isDarkMode ? '#FFFFFF' : '#333333'} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      <LinearGradient
        colors={isDarkMode ? ['#1A1A2E', '#16213E'] : ['#E8F0FE', '#C7D2FE']}
        style={styles.gradient}
      >
        {currentScreen === 'unlock' ? (
          <Animated.View 
            style={[
              styles.unlockContainer,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                backgroundColor: isDarkMode ? 'rgba(30, 30, 50, 0.8)' : 'rgba(255, 255, 255, 0.9)'
              }
            ]}
          >
            <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
              Welcome Back
            </Text>
            <Text style={[styles.subtitle, { color: isDarkMode ? '#BBBBBB' : '#666666' }]}>
              Enter your password to unlock
            </Text>
            
            <View style={styles.inputGroup}>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
                    color: isDarkMode ? '#FFFFFF' : '#333333',
                    borderColor: passwordError ? '#FF6B6B' : isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                  }
                ]}
                placeholder="Enter password"
                placeholderTextColor={isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)'}
                secureTextEntry
                value={lockPassword}
                onChangeText={(text) => {
                  setLockPassword(text);
                  setPasswordError('');
                }}
              />
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>
            
            <TouchableOpacity 
              style={styles.unlockButton} 
              onPress={unlockApp}
            >
              <LinearGradient
                colors={['#4776E6', '#8E54E9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.unlockButtonText}>
                  Unlock
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setIsLocked(false)}>
              <Text style={[styles.exitText, { color: isDarkMode ? '#8E54E9' : '#4776E6' }]}>
                Exit Lock Screen
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <SafeAreaView style={styles.safeArea}>
            {renderDynamicIsland()}
            
            <View style={styles.screenContainer}>
              <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
                  {currentScreen === 'notification' ? 'Notifications' : 'My Apps'}
                </Text>
                <View style={styles.headerButtons}>
                  <TouchableOpacity 
                    style={[
                      styles.headerButton, 
                      currentScreen === 'notification' && styles.activeHeaderButton
                    ]}
                    onPress={() => setCurrentScreen('notification')}
                  >
                    <Icon 
                      name="notifications" 
                      size={24} 
                      color={currentScreen === 'notification' 
                        ? (isDarkMode ? '#FFFFFF' : '#333333') 
                        : (isDarkMode ? '#BBBBBB' : '#666666')
                      } 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.headerButton, 
                      currentScreen === 'apps' && styles.activeHeaderButton
                    ]}
                    onPress={() => setCurrentScreen('apps')}
                  >
                    <Icon 
                      name="apps" 
                      size={24} 
                      color={currentScreen === 'apps' 
                        ? (isDarkMode ? '#FFFFFF' : '#333333') 
                        : (isDarkMode ? '#BBBBBB' : '#666666')
                      } 
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.headerButton}
                    onPress={() => setIsLocked(false)}
                  >
                    <Icon 
                      name="exit-to-app" 
                      size={24} 
                      color={isDarkMode ? '#BBBBBB' : '#666666'} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
              
              {currentScreen === 'notification' ? (
                <FlatList
                  data={notifications}
                  renderItem={renderNotificationItem}
                  keyExtractor={item => item.id}
                  contentContainerStyle={styles.notificationList}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <FlatList
                  data={apps}
                  renderItem={renderAppItem}
                  keyExtractor={item => item.id}
                  numColumns={3}
                  contentContainerStyle={styles.appGrid}
                  showsVerticalScrollIndicator={false}
                />
              )}
            </View>
          </SafeAreaView>
        )}
        
        {/* App Settings Modal */}
        <Modal
          visible={appSettingsVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setAppSettingsVisible(false)}
        >
          <Pressable 
            style={styles.modalOverlay}
            onPress={() => setAppSettingsVisible(false)}
          >
            <Pressable 
              style={[
                styles.appSettingsContainer,
                { backgroundColor: isDarkMode ? 'rgba(30, 30, 50, 0.95)' : 'rgba(255, 255, 255, 0.95)' }
              ]}
              onPress={e => e.stopPropagation()}
            >
              <View style={styles.appSettingsHeader}>
                {selectedApp && (
                  <>
                    <Image source={selectedApp.icon} style={styles.appSettingsIcon} />
                    <Text style={[styles.appSettingsTitle, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
                      {selectedApp.name}
                    </Text>
                  </>
                )}
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setAppSettingsVisible(false)}
                >
                  <Icon name="close" size={24} color={isDarkMode ? '#FFFFFF' : '#333333'} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
                    Lock App
                  </Text>
                  <Text style={[styles.settingDescription, { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }]}>
                    Require password to open this app
                  </Text>
                </View>
                {selectedApp && (
                  <Switch
                    value={selectedApp.locked}
                    onValueChange={() => toggleAppLock(selectedApp.id)}
                    trackColor={{ false: isDarkMode ? '#555' : '#D0D0D0', true: '#8E54E9' }}
                    thumbColor={selectedApp.locked ? '#FFFFFF' : '#F4F3F4'}
                  />
                )}
              </View>
              
              <View style={styles.settingItem}>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingTitle, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
                    Hide Notifications
                  </Text>
                  <Text style={[styles.settingDescription, { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }]}>
                    Hide notification content when app is locked
                  </Text>
                </View>
                <Switch
                  value={false}
                  trackColor={{ false: isDarkMode ? '#555' : '#D0D0D0', true: '#8E54E9' }}
                  thumbColor={'#F4F3F4'}
                />
              </View>
              
              <TouchableOpacity 
                style={styles.appSettingsButton}
                onPress={() => setAppSettingsVisible(false)}
              >
                <LinearGradient
                  colors={['#4776E6', '#8E54E9']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.appSettingsButtonText}>
                    Save Settings
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
  },
  unlockContainer: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    marginTop: 100,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  unlockButton: {
    height: 50,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  exitText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  // Dynamic Island
  dynamicIsland: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  dynamicIslandGradient: {
    flex: 1,
    borderRadius: 20,
  },
  dynamicIslandContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  expandedIslandContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  notificationIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  notificationTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  closeNotificationButton: {
    padding: 5,
  },
  notificationListIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  notificationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    paddingTop: 50, // Space for dynamic island
  },
  screenContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 15,
    padding: 5,
  },
  activeHeaderButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#8E54E9',
  },
  notificationList: {
    paddingBottom: 20,
  },
  notificationItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  notificationTime: {
    fontSize: 12,
  },
  notificationContent: {
    fontSize: 14,
    lineHeight: 20,
    overflow: 'hidden',
  },
  notificationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  notificationAction: {
    marginLeft: 16,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  appGrid: {
    paddingBottom: 20,
  },
  appItem: {
    width: (width - 32) / 3,
    alignItems: 'center',
    marginBottom: 24,
  },
  appItemContainer: {
    alignItems: 'center',
    width: '100%',
  },
  appButton: {
    alignItems: 'center',
    width: '100%',
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    marginBottom: 8,
  },
  lockIconContainer: {
    position: 'absolute',
    bottom: 8,
    right: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 70,
  },
  appMenuButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appSettingsContainer: {
    width: width * 0.85,
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  appSettingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  appSettingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 12,
  },
  appSettingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  appSettingsButton: {
    height: 50,
    borderRadius: 12,
    marginTop: 24,
    overflow: 'hidden',
  },
  appSettingsButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default LockScreen;