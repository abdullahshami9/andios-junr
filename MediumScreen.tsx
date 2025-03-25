import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Appearance,
  Switch,
  Easing,
  Image
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './MediumScreenStyles';
import RobotAnimation from './RobotAnimation1';
import { NotificationsTab } from './NotificationsTab';
import { AppsTab } from './AppsTab';
import { PaymentsTab } from './PaymentsTab';
import { TasksTab } from './TasksTab';

const { height } = Dimensions.get('window');

// Mock data (could be moved to separate files if needed)
const MOCK_APPS = [
  { id: '1', name: 'Messages', icon: 'https://img.icons8.com/color/96/000000/chat--v1.png', locked: false },
  { id: '2', name: 'Photos', icon: 'https://img.icons8.com/color/96/000000/picture.png', locked: true },
  { id: '3', name: 'Camera', icon: 'https://img.icons8.com/color/96/000000/camera--v1.png', locked: false },
  { id: '4', name: 'Maps', icon: 'https://img.icons8.com/color/96/000000/google-maps.png', locked: true },
  { id: '5', name: 'Calendar', icon: 'https://img.icons8.com/color/96/000000/calendar--v1.png', locked: false },
  { id: '6', name: 'Clock', icon: 'https://img.icons8.com/color/96/000000/clock--v1.png', locked: false },
  { id: '7', name: 'Weather', icon: 'https://img.icons8.com/color/96/000000/partly-cloudy-day--v1.png', locked: false },
  { id: '8', name: 'Notes', icon: 'https://img.icons8.com/color/96/000000/notes.png', locked: true },
  { id: '9', name: 'Settings', icon: 'https://img.icons8.com/color/96/000000/settings--v1.png', locked: false },
  { id: '10', name: 'Music', icon: 'https://img.icons8.com/color/96/000000/music.png', locked: false },
  { id: '11', name: 'Files', icon: 'https://img.icons8.com/color/96/000000/folder-invoices--v1.png', locked: true },
  { id: '12', name: 'Store', icon: 'https://img.icons8.com/color/96/000000/shop.png', locked: false },
];


const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'New Message', content: 'John: Hey, how are you doing?', app: 'Messages', time: '2 min ago', read: false },
  // ... rest of the mock data
];

// Mock payment methods
const MOCK_PAYMENT_METHODS = [
  { id: '1', name: 'Visa', last4: '4242', icon: 'https://img.icons8.com/color/96/000000/visa.png', default: true },
  { id: '2', name: 'Mastercard', last4: '5555', icon: 'https://img.icons8.com/color/96/000000/mastercard.png', default: false },
  { id: '3', name: 'PayPal', email: 'user@example.com', icon: 'https://img.icons8.com/color/96/000000/paypal.png', default: false },
  { id: '4', name: 'Apple Pay', icon: 'https://img.icons8.com/color/96/000000/apple-pay.png', default: false },
];

// Mock recent transactions
const MOCK_TRANSACTIONS = [
  { id: '1', merchant: 'Netflix', amount: '$12.99', date: '2023-05-15', category: 'Entertainment' },
  { id: '2', merchant: 'Amazon', amount: '$34.76', date: '2023-05-12', category: 'Shopping' },
  { id: '3', merchant: 'Uber', amount: '$8.50', date: '2023-05-10', category: 'Transportation' },
  { id: '4', merchant: 'Starbucks', amount: '$4.25', date: '2023-05-09', category: 'Food & Drink' },
];

const MediumScreen = ({ setIsLocked }) => {
  const [currentTab, setCurrentTab] = useState('notification');
  const [apps, setApps] = useState(MOCK_APPS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [expandedNotification, setExpandedNotification] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState(MOCK_PAYMENT_METHODS);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  
  const [settings, setSettings] = useState({
    darkMode: Appearance.getColorScheme() === 'dark',
    notifications: true,
    biometricAuth: true,
    dataSync: false,
    autoLock: true
  });
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;
  
  const colorScheme = Appearance.getColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const settingsOverlayAnim = useRef(new Animated.Value(0)).current;
  const settingsContentAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
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
      })
    ]).start();
    
    const notificationInterval = setInterval(() => {
      const newNotification = {
        id: Date.now().toString(),
        title: 'New Notification',
        content: 'This is a real-time notification that just arrived.',
        app: 'System',
        time: 'Just now',
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev]);
    }, 20000);
    
    return () => clearInterval(notificationInterval);
  }, []);

  useEffect(() => {
    Animated.timing(tabIndicatorAnim, {
      toValue: currentTab === 'notification' ? 0 : 
               currentTab === 'apps' ? 0.33 : 
               currentTab === 'payments' ? 0.67 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentTab]);

  const expandNotification = (notification) => {
    setExpandedNotification(notification.id);
  };

  const collapseNotification = () => {
    setExpandedNotification(null);
  };

  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const setDefaultPaymentMethod = (id) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        default: method.id === id
      }))
    );
  };

  const openSettings = () => {
    setIsSettingsVisible(true);
    Animated.parallel([
      Animated.timing(settingsOverlayAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(settingsContentAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.back(1)),
        useNativeDriver: true
      })
    ]).start();
  };

  const closeSettings = () => {
    Animated.parallel([
      Animated.timing(settingsOverlayAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(settingsContentAnim, {
        toValue: height,
        duration: 350,
        easing: Easing.in(Easing.back(1)),
        useNativeDriver: true
      })
    ]).start(() => {
      setIsSettingsVisible(false);
    });
  };

  const renderSettingItem = ({ title, description, value, onToggle }) => {
    return (
      <View style={styles.settingItem}>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
            {title}
          </Text>
          <Text style={[styles.settingDescription, { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }]}>
            {description}
          </Text>
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: isDarkMode ? '#555' : '#D0D0D0', true: '#8E54E9' }}
          thumbColor={value ? '#FFFFFF' : '#F4F3F4'}
        />
      </View>
    );
  };

  const renderSettingsOverlay = () => {
    const overlayOpacity = settingsOverlayAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.8]
    });

    const contentTranslate = settingsContentAnim;

    return (
      <Modal
        transparent={true}
        visible={isSettingsVisible}
        animationType="none"
        onRequestClose={closeSettings}
        statusBarTranslucent={true}
      >
        <Animated.View 
          style={[
            styles.settingsOverlay,
            { 
              opacity: overlayOpacity,
              backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)'
            }
          ]}
        >
          <TouchableWithoutFeedback onPress={closeSettings}>
            <View style={styles.settingsOverlayBackground} />
          </TouchableWithoutFeedback>

          <Animated.View 
            style={[
              styles.settingsContainer,
              { 
                transform: [{ translateY: contentTranslate }],
                backgroundColor: isDarkMode ? '#1A1A2E' : '#F5F7FF'
              }
            ]}
          >
            <LinearGradient
              colors={isDarkMode ? ['#1A1A2E', '#16213E'] : ['#F5F7FF', '#E8F0FE']}
              style={styles.settingsGradient}
            >
              <SafeAreaView style={styles.settingsSafeArea}>
                <View style={[
                  styles.settingsHeader, 
                  { 
                    borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                  }
                ]}>
                  <Text style={[styles.settingsTitle, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
                    Settings
                  </Text>
                  <TouchableOpacity 
                    style={styles.closeSettingsButton}
                    onPress={closeSettings}
                  >
                    <Icon name="close" size={24} color={isDarkMode ? '#FFFFFF' : '#333333'} />
                  </TouchableOpacity>
                </View>

                <View style={styles.settingsContent}>
                  {renderSettingItem({
                    title: 'Dark Mode',
                    description: 'Enable dark theme for the app',
                    value: settings.darkMode,
                    onToggle: () => toggleSetting('darkMode')
                  })}
                  
                  {renderSettingItem({
                    title: 'Notifications',
                    description: 'Receive push notifications',
                    value: settings.notifications,
                    onToggle: () => toggleSetting('notifications')
                  })}
                  
                  {renderSettingItem({
                    title: 'Biometric Authentication',
                    description: 'Use fingerprint or face ID to unlock',
                    value: settings.biometricAuth,
                    onToggle: () => toggleSetting('biometricAuth')
                  })}
                  
                  {renderSettingItem({
                    title: 'Data Synchronization',
                    description: 'Sync data across devices',
                    value: settings.dataSync,
                    onToggle: () => toggleSetting('dataSync')
                  })}
                  
                  {renderSettingItem({
                    title: 'Auto-Lock',
                    description: 'Automatically lock app when inactive',
                    value: settings.autoLock,
                    onToggle: () => toggleSetting('autoLock')
                  })}
                  
                  <TouchableOpacity 
                    style={[styles.logoutButton, { backgroundColor: isDarkMode ? 'rgba(255, 107, 107, 0.2)' : 'rgba(255, 107, 107, 0.1)' }]}
                    onPress={() => Alert.alert('Logout', 'Are you sure you want to log out?', [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Logout', style: 'destructive', onPress: () => console.log('Logout pressed') }
                    ])}
                  >
                    <Icon name="logout" size={20} color="#FF6B6B" />
                    <Text style={styles.logoutText}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      </Modal>
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
        <SafeAreaView style={styles.safeArea}>
          <Animated.View 
            style={[
              styles.contentContainer,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={[styles.header, { paddingTop: 20 }]}>
              <Text style={[styles.headerTitle, { color: isDarkMode ? '#888888' : '#888888' }]}>
                Junr
              </Text>
              <RobotAnimation emotion='lookout'/>
              <View style={styles.headerButtons}>
                <TouchableOpacity onPress={openSettings}>
                  <Image 
                    source={require('./assets/icons/setting.png')} 
                    style={[
                      styles.settingsIcon,
                      { tintColor: isDarkMode ? '#FFFFFF' : '#333333' }
                    ]} 
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={styles.tabButton}
                onPress={() => setCurrentTab('notification')}
              >
                <Text 
                  style={[
                    styles.tabText, 
                    { 
                      color: currentTab === 'notification' 
                        ? (isDarkMode ? '#FFFFFF' : '#333333') 
                        : (isDarkMode ? '#BBBBBB' : '#666666')
                    }
                  ]}
                >
                  Notifications
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.tabButton}
                onPress={() => setCurrentTab('apps')}
              >
                <Text 
                  style={[
                    styles.tabText, 
                    { 
                      color: currentTab === 'apps' 
                        ? (isDarkMode ? '#FFFFFF' : '#333333') 
                        : (isDarkMode ? '#BBBBBB' : '#666666')
                    }
                  ]}
                >
                  Apps
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.tabButton}
                onPress={() => setCurrentTab('payments')}
              >
                <Text 
                  style={[
                    styles.tabText, 
                    { 
                      color: currentTab === 'payments' 
                        ? (isDarkMode ? '#FFFFFF' : '#333333') 
                        : (isDarkMode ? '#BBBBBB' : '#666666')
                    }
                  ]}
                >
                  Payments
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.tabButton}
                onPress={() => setCurrentTab('general')}
              >
                <Text 
                  style={[
                    styles.tabText, 
                    { 
                      color: currentTab === 'general' 
                        ? (isDarkMode ? '#FFFFFF' : '#333333') 
                        : (isDarkMode ? '#BBBBBB' : '#666666')
                    }
                  ]}
                >
                  General
                </Text>
              </TouchableOpacity>
              
              <Animated.View 
                style={[
                  styles.tabIndicator,
                  {
                    backgroundColor: isDarkMode ? '#8E54E9' : '#4776E6',
                    left: tabIndicatorAnim.interpolate({
                      inputRange: [0, 0.33, 0.67, 1],
                      outputRange: ['0%', '25%', '50%', '75%']
                    }),
                    width: '25%'
                  }
                ]}
              />
            </View>
            
            <View style={styles.contentArea}>
              {currentTab === 'notification' ? (
                <NotificationsTab
                  notifications={notifications}
                  expandedNotification={expandedNotification}
                  isDarkMode={isDarkMode}
                  expandNotification={expandNotification}
                  collapseNotification={collapseNotification}
                />
              ) : currentTab === 'apps' ? (
                <AppsTab
                  apps={apps}
                  isDarkMode={isDarkMode}
                  fadeAnim={fadeAnim}
                  slideAnim={slideAnim}
                />
              ) : currentTab === 'payments' ? (
                <PaymentsTab
                  paymentMethods={paymentMethods}
                  transactions={transactions}
                  isDarkMode={isDarkMode}
                  setDefaultPaymentMethod={setDefaultPaymentMethod}
                />
              ) : (
                <TasksTab isDarkMode={isDarkMode} />
              )}
            </View>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
      
      {renderSettingsOverlay()}
    </View>
  );
};

export default MediumScreen;