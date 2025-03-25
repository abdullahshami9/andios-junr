import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Animated,
  Dimensions,
  StatusBar,
  FlatList,
  Image,
  SafeAreaView,
  Alert,
  Switch,
  Easing
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Appearance } from 'react-native';
import RobotAnimation from './RobotAnimation1';
// import RobotAnimation from './RobotAnimation';

const junrLogo = require('./assets/junr.png');

const { width, height } = Dimensions.get('window');

// Mock data for app grid
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

// Mock notifications
const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'New Message', content: 'John: Hey, how are you doing?', app: 'Messages', time: '2 min ago', read: false },
  { id: '2', title: 'Calendar Reminder', content: 'Meeting with design team at 3:00 PM', app: 'Calendar', time: '15 min ago', read: false },
  { id: '3', title: 'Weather Alert', content: 'Heavy rain expected in your area', app: 'Weather', time: '30 min ago', read: true },
  { id: '4', title: 'New Email', content: 'Project update from Sarah', app: 'Mail', time: '1 hour ago', read: true },
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

const MediumScreen = ({ setIsLocked }: { setIsLocked: (locked: boolean) => void }) => {
  const [currentTab, setCurrentTab] = useState('notification'); // 'notification', 'apps', 'payments', 'general'
  const [apps, setApps] = useState(MOCK_APPS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [expandedNotification, setExpandedNotification] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState(MOCK_PAYMENT_METHODS);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  
  // Settings for General tab
  const [settings, setSettings] = useState({
    darkMode: Appearance.getColorScheme() === 'dark',
    notifications: true,
    biometricAuth: true,
    dataSync: false,
    autoLock: true
  });
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;
  
  const colorScheme = Appearance.getColorScheme();
  const isDarkMode = colorScheme === 'dark';

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
      })
    ]).start();
    
    // Add a new notification every 20 seconds
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
    // Animate tab indicator
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

  const goToLockScreen = () => {
    setIsLocked(true);
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

  const renderNotificationItem = ({ item }) => {
    const isExpanded = expandedNotification === item.id;
    
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
          <Text style={[styles.notificationTitle, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
            {item.title}
          </Text>
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

  const renderAppItem = ({ item }) => {
    return (
      <Animated.View
        style={[
          styles.appItem,
          {
            opacity: fadeAnim,
            transform: [
              { scale: fadeAnim },
              { translateY: slideAnim }
            ]
          }
        ]}
      >
        <View style={styles.appItemContainer}>
          <TouchableOpacity 
            style={styles.appButton}
            onPress={() => Alert.alert('App Launch', `Opening ${item.name}${item.locked ? ' (Locked)' : ''}`)}
          >
            <Image source={{ uri: item.icon }} style={styles.appIcon} />
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
            onPress={() => Alert.alert('App Settings', `Configure ${item.name}`)}
          >
            <Icon name="more-vert" size={18} color={isDarkMode ? '#BBBBBB' : '#666666'} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const renderPaymentMethodItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={[
          styles.paymentMethodItem,
          { 
            backgroundColor: isDarkMode 
              ? 'rgba(30, 30, 50, 0.8)'
              : 'rgba(255, 255, 255, 0.9)',
          }
        ]}
        onPress={() => setDefaultPaymentMethod(item.id)}
      >
        <View style={styles.paymentMethodContent}>
          <Image source={{ uri: item.icon }} style={styles.paymentIcon} />
          <View style={styles.paymentDetails}>
            <Text style={[styles.paymentName, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
              {item.name}
            </Text>
            <Text style={[styles.paymentInfo, { color: isDarkMode ? '#BBBBBB' : '#666666' }]}>
              {item.last4 ? `•••• ${item.last4}` : item.email || ''}
            </Text>
          </View>
          {item.default && (
            <View style={[styles.defaultBadge, { backgroundColor: isDarkMode ? '#8E54E9' : '#4776E6' }]}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderTransactionItem = ({ item }) => {
    return (
      <View 
        style={[
          styles.transactionItem,
          { 
            backgroundColor: isDarkMode 
              ? 'rgba(30, 30, 50, 0.6)'
              : 'rgba(255, 255, 255, 0.7)',
          }
        ]}
      >
        <View style={styles.transactionDetails}>
          <Text style={[styles.merchantName, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
            {item.merchant}
          </Text>
          <Text style={[styles.transactionCategory, { color: isDarkMode ? '#BBBBBB' : '#666666' }]}>
            {item.category} • {item.date}
          </Text>
        </View>
        <Text style={[styles.transactionAmount, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
          {item.amount}
        </Text>
      </View>
    );
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
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: isDarkMode ? '#888888' : '#888888' }]}>
                Junr
              </Text>
              <RobotAnimation emotion='lookout'/>
              {/* <RobotAnimation emotion="loockout" /> */}
              <TouchableOpacity 
                style={styles.lockButton}
                onPress={goToLockScreen}
              >
                <Icon name="lock" size={24} color={isDarkMode ? '#FFFFFF' : '#333333'} />
              </TouchableOpacity>
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
                <FlatList
                  key="notifications"
                  data={notifications}
                  renderItem={renderNotificationItem}
                  keyExtractor={item => item.id}
                  contentContainerStyle={styles.notificationList}
                  showsVerticalScrollIndicator={false}
                />
              ) : currentTab === 'apps' ? (
                <FlatList
                  key="apps"
                  data={apps}
                  renderItem={renderAppItem}
                  keyExtractor={item => item.id}
                  numColumns={3}
                  contentContainerStyle={styles.appGrid}
                  showsVerticalScrollIndicator={false}
                />
              ) : currentTab === 'payments' ? (
                <View style={styles.paymentsContainer}>
                  <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
                    Payment Methods
                  </Text>
                  <FlatList
                    key="paymentMethods"
                    data={paymentMethods}
                    renderItem={renderPaymentMethodItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.paymentMethodsList}
                    showsVerticalScrollIndicator={false}
                  />
                  
                  <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#333333', marginTop: 20 }]}>
                    Recent Transactions
                  </Text>
                  <FlatList
                    key="transactions"
                    data={transactions}
                    renderItem={renderTransactionItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.transactionsList}
                    showsVerticalScrollIndicator={false}
                  />
                  
                  <TouchableOpacity 
                    style={[styles.addButton, { backgroundColor: isDarkMode ? '#8E54E9' : '#4776E6' }]}
                    onPress={() => Alert.alert('Add Payment Method', 'This would open a form to add a new payment method.')}
                  >
                    <Icon name="add" size={24} color="#FFFFFF" />
                    <Text style={styles.addButtonText}>Add Payment Method</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.generalContainer}>
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
              )}
            </View>
          </Animated.View>
        </SafeAreaView>
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
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  lockButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabContainer: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
    position: 'relative',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    borderRadius: 1.5,
  },
  contentArea: {
    flex: 1,
  },
  // Notification styles
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
  // App Grid styles
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
  // Payments styles
  paymentsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  paymentMethodsList: {
    paddingBottom: 10,
  },
  paymentMethodItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
  },
  paymentInfo: {
    fontSize: 14,
    marginTop: 2,
  },
  defaultBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  transactionsList: {
    paddingBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  transactionDetails: {
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: '500',
  },
  transactionCategory: {
    fontSize: 12,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  // General settings styles
  generalContainer: {
    flex: 1,
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    marginTop: 30,
  },
  logoutText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default MediumScreen;