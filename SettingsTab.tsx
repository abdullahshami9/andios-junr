import React, { useRef, useEffect } from 'react';
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
  Switch,
  Easing,
  Image,
  Appearance
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './MediumScreenStyles';

const { height } = Dimensions.get('window');

const SettingsTab = ({ visible, onClose, settings, setSettings, isDarkMode }) => {
  const settingsOverlayAnim = useRef(new Animated.Value(0)).current;
  const settingsContentAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
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
    } else {
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
      ]).start();
    }
  }, [visible]);

  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
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

  const overlayOpacity = settingsOverlayAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.8]
  });

  const contentTranslate = settingsContentAnim;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
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
        <TouchableWithoutFeedback onPress={onClose}>
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
                  onPress={onClose}
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

export default SettingsTab;