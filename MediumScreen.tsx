import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Image,
  Appearance
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from './MediumScreenStyles';
import RobotAnimation from './RobotAnimation1';
import DynamicIsland from './DynamicIsland';
import { NotificationsTab } from './NotificationsTab';
import { AppsTab } from './AppsTab';
import { PaymentsTab } from './PaymentsTab';
import { TasksTab } from './TasksTab';
import SettingsTab from './SettingsTab';

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
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  const colorScheme = Appearance.getColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [settings, setSettings] = useState({
    darkMode: isDarkMode,
    notifications: true,
    biometricAuth: true,
    dataSync: false,
    autoLock: true
  });

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

  const expandNotification = (notification) => {
    setExpandedNotification(notification.id);
  };

  const collapseNotification = () => {
    setExpandedNotification(null);
  };

  const setDefaultPaymentMethod = (id) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        default: method.id === id
      }))
    );
  };
  
  return (
    <View style={styles.container}>
      <DynamicIsland />
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
            <View style={[styles.header, { paddingTop: 10 }]}>
              <Text style={[styles.headerTitle, { color: isDarkMode ? '#888888' : '#888888' }]}>
                Junr
              </Text>
              {/* <RobotAnimation emotion='lookout'/>  */}
              {/* <DynamicIsland /> */}
              <View style={styles.headerButtons}>
                <TouchableOpacity onPress={() => setIsSettingsVisible(true)}>
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
            
            {/* Modern Navigation Tabs */}
            <View style={[styles.tabContainer, { 
              backgroundColor: isDarkMode ? 'rgba(30, 30, 50, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              borderRadius: 20,
              marginHorizontal: 16,
              marginBottom: 12,
              paddingVertical: 4,
              elevation: 8,
              shadowColor: isDarkMode ? '#8E54E9' : '#4776E6',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 6,
            }]}>
              <TouchableOpacity 
                style={[styles.tabButton, { paddingVertical: 12 }]}
                onPress={() => setCurrentTab('notification')}
              >
                <Image
                  source={currentTab === 'notification' ? 
                    require('./assets/icons/notification.png') : 
                    require('./assets/icons/notification.png')}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: currentTab === 'notification' ? 
                      (isDarkMode ? '#8E54E9' : '#4776E6') : 
                      (isDarkMode ? '#BBBBBB' : '#666666')
                  }}
                />
                {currentTab === 'notification' && (
                  <Text style={[
                    styles.tabText, 
                    { 
                      color: currentTab === 'notification' ? 
                        (isDarkMode ? '#8E54E9' : '#4776E6') : 
                        (isDarkMode ? '#BBBBBB' : '#666666'),
                      fontSize: 12,
                      marginTop: 4,
                      fontWeight: '600'
                    }
                  ]}>
                    Notifications
                  </Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.tabButton, { paddingVertical: 12 }]}
                onPress={() => setCurrentTab('apps')}
              >
                <Image
                  source={currentTab === 'apps' ? 
                    require('./assets/icons/app.png') : 
                    require('./assets/icons/app.png')}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: currentTab === 'apps' ? 
                      (isDarkMode ? '#8E54E9' : '#4776E6') : 
                      (isDarkMode ? '#BBBBBB' : '#666666')
                  }}
                />
                {currentTab === 'apps' && (
                  <Text style={[
                    styles.tabText, 
                    { 
                      color: currentTab === 'apps' ? 
                        (isDarkMode ? '#8E54E9' : '#4776E6') : 
                        (isDarkMode ? '#BBBBBB' : '#666666'),
                      fontSize: 12,
                      marginTop: 4,
                      fontWeight: '600'
                    }
                  ]}>
                    Apps
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.tabButton, { paddingVertical: 12 }]}
                onPress={() => setCurrentTab('payments')}
              >
                <Image
                  source={currentTab === 'payments' ? 
                    require('./assets/icons/payment.png') : 
                    require('./assets/icons/payment.png')}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: currentTab === 'payments' ? 
                      (isDarkMode ? '#8E54E9' : '#4776E6') : 
                      (isDarkMode ? '#BBBBBB' : '#666666')
                  }}
                />
                {currentTab === 'payments' && (
                  <Text style={[
                    styles.tabText, 
                    { 
                      color: currentTab === 'payments' ? 
                        (isDarkMode ? '#8E54E9' : '#4776E6') : 
                        (isDarkMode ? '#BBBBBB' : '#666666'),
                      fontSize: 12,
                      marginTop: 4,
                      fontWeight: '600'
                    }
                  ]}>
                    Payments
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.tabButton, { paddingVertical: 12 }]}
                onPress={() => setCurrentTab('general')}
              >
                <Image
                  source={currentTab === 'general' ? 
                    require('./assets/icons/general.png') : 
                    require('./assets/icons/general.png')}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: currentTab === 'general' ? 
                      (isDarkMode ? '#8E54E9' : '#4776E6') : 
                      (isDarkMode ? '#BBBBBB' : '#666666')
                  }}
                />
                {currentTab === 'general' && (
                  <Text style={[
                    styles.tabText, 
                    { 
                      color: currentTab === 'general' ? 
                        (isDarkMode ? '#8E54E9' : '#4776E6') : 
                        (isDarkMode ? '#BBBBBB' : '#666666'),
                      fontSize: 12,
                      marginTop: 4,
                      fontWeight: '600'
                    }
                  ]}>
                    General
                  </Text>
                )}
              </TouchableOpacity>
              
              {/* Commented out the tab bar indicator */}
              {/* <Animated.View 
                style={[
                  {
                    position: 'absolute',
                    bottom: 4,
                    height: 3,
                    backgroundColor: isDarkMode ? '#8E54E9' : '#4776E6',
                    borderRadius: 3,
                    left: tabIndicatorAnim.interpolate({
                      inputRange: [0, 0.33, 0.67, 1],
                      outputRange: ['2%', '26%', '50%', '74%']
                    }),
                    width: '24%',
                    elevation: 8,
                    shadowColor: isDarkMode ? '#8E54E9' : '#4776E6',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.4,
                    shadowRadius: 4,
                  }
                ]}
              /> */}
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
      
      <SettingsTab
        visible={isSettingsVisible}
        onClose={() => setIsSettingsVisible(false)}
        settings={settings}
        setSettings={setSettings}
        isDarkMode={isDarkMode}
      />
    </View>
  );
};

export default MediumScreen;