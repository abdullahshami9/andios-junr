import React, { useState, useEffect } from 'react';
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
  Image
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import SQLite from 'react-native-sqlite-storage';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

// Mock data for app grid
const MOCK_APPS = [
  { id: '1', name: 'Messages', icon: 'https://img.icons8.com/color/96/000000/chat--v1.png' },
  { id: '2', name: 'Photos', icon: 'https://img.icons8.com/color/96/000000/picture.png' },
  { id: '3', name: 'Camera', icon: 'https://img.icons8.com/color/96/000000/camera--v1.png' },
  { id: '4', name: 'Maps', icon: 'https://img.icons8.com/color/96/000000/google-maps.png' },
  { id: '5', name: 'Calendar', icon: 'https://img.icons8.com/color/96/000000/calendar--v1.png' },
  { id: '6', name: 'Clock', icon: 'https://img.icons8.com/color/96/000000/clock--v1.png' },
  { id: '7', name: 'Weather', icon: 'https://img.icons8.com/color/96/000000/partly-cloudy-day--v1.png' },
  { id: '8', name: 'Notes', icon: 'https://img.icons8.com/color/96/000000/notes.png' },
  { id: '9', name: 'Settings', icon: 'https://img.icons8.com/color/96/000000/settings--v1.png' },
  { id: '10', name: 'Music', icon: 'https://img.icons8.com/color/96/000000/music.png' },
  { id: '11', name: 'Files', icon: 'https://img.icons8.com/color/96/000000/folder-invoices--v1.png' },
  { id: '12', name: 'Store', icon: 'https://img.icons8.com/color/96/000000/shop.png' },
];

const LockScreen = ({ setIsLocked }: { setIsLocked: (locked: boolean) => void }) => {
  const [lockPassword, setLockPassword] = useState('');
  const [db, setDb] = useState(null);
  const [isUnlocking, setIsUnlocking] = useState(true);
  const [passwordError, setPasswordError] = useState('');
  const [userData, setUserData] = useState([]);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];
  const appsGridAnim = useState(new Animated.Value(0))[0];
  
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
        setIsUnlocking(false);
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
        <TouchableOpacity style={styles.appButton}>
          <Image source={{ uri: item.icon }} style={styles.appIcon} />
          <Text style={[styles.appName, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
            {item.name}
          </Text>
        </TouchableOpacity>
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
        {isUnlocking ? (
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
          <View style={styles.appsContainer}>
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
                My Apps
              </Text>
              <TouchableOpacity onPress={() => setIsLocked(false)}>
                <Text style={[styles.exitText, { color: isDarkMode ? '#8E54E9' : '#4776E6' }]}>
                  Exit
                </Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={MOCK_APPS}
              renderItem={renderAppItem}
              keyExtractor={item => item.id}
              numColumns={4}
              contentContainerStyle={styles.appGrid}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
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
  appsContainer: {
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
  appGrid: {
    paddingBottom: 20,
  },
  appItem: {
    width: width / 4 - 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  appButton: {
    alignItems: 'center',
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    marginBottom: 8,
  },
  appName: {
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 70,
  }
});

export default LockScreen;