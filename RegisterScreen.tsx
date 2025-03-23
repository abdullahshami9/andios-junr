// RegisterScreen.tsx
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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import SQLite from 'react-native-sqlite-storage';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ setIsLogin }: { setIsLogin: (isLogin: boolean) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    dob: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  
  const colorScheme = Appearance.getColorScheme();
  const isDarkMode = colorScheme === 'dark';
  
  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const validateEmail = (text: string) => {
    setEmail(text);
    if (!text) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(text)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email' }));
      return false;
    }
    setErrors(prev => ({ ...prev, email: '' }));
    return true;
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    if (!text) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      return false;
    }
    if (text.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      return false;
    }
    setErrors(prev => ({ ...prev, password: '' }));
    return true;
  };

  const validateDob = (text: string) => {
    setDob(text);
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!text) {
      setErrors(prev => ({ ...prev, dob: 'Date of birth is required' }));
      return false;
    }
    if (!dobRegex.test(text)) {
      setErrors(prev => ({ ...prev, dob: 'Use format YYYY-MM-DD' }));
      return false;
    }
    setErrors(prev => ({ ...prev, dob: '' }));
    return true;
  };

  const handleRegister = () => {
    // Validate all fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isDobValid = validateDob(dob);
    
    if (!isEmailValid || !isPasswordValid || !isDobValid) {
      return;
    }

    setIsLoading(true);

    SQLite.openDatabase(
      { name: 'AppLockDB', location: 'default' },
      (db) => {
        db.transaction((tx) => {
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, dob TEXT, gender TEXT)',
            [],
            () => {
              tx.executeSql(
                'INSERT INTO users (email, password, dob, gender) VALUES (?, ?, ?, ?)',
                [email, password, dob, gender],
                () => {
                  setIsLoading(false);
                  // Success animation
                  Animated.sequence([
                    Animated.timing(fadeAnim, {
                      toValue: 0.5,
                      duration: 200,
                      useNativeDriver: true,
                    }),
                    Animated.timing(fadeAnim, {
                      toValue: 1,
                      duration: 200,
                      useNativeDriver: true,
                    })
                  ]).start(() => {
                    Alert.alert('Success', 'Registered successfully');
                    setIsLogin(true);
                  });
                },
                (_, error) => {
                  setIsLoading(false);
                  console.error('Registration failed:', error);
                  Alert.alert('Error', 'Registration failed. Please try again.');
                  return true;
                }
              );
            },
            (_, error) => {
              setIsLoading(false);
              console.error('Table creation failed:', error);
              Alert.alert('Error', 'Database error. Please try again.'); 
              return true;
            }
          );
        });
      },
      (error) => {
        setIsLoading(false);
        console.error('Database open error:', error);
        Alert.alert('Error', 'Database connection failed. Please try again.');
      }
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      <LinearGradient
        colors={isDarkMode ? ['#1A1A2E', '#16213E'] : ['#E8F0FE', '#C7D2FE']}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View 
            style={[
              styles.formContainer,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
                backgroundColor: isDarkMode ? 'rgba(30, 30, 50, 0.8)' : 'rgba(255, 255, 255, 0.9)'
              }
            ]}
          >
            <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
              Create Account
            </Text>
            <Text style={[styles.subtitle, { color: isDarkMode ? '#BBBBBB' : '#666666' }]}>
              Join our community
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: isDarkMode ? '#BBBBBB' : '#666666' }]}>Email</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
                    color: isDarkMode ? '#FFFFFF' : '#333333',
                    borderColor: errors.email ? '#FF6B6B' : isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                  }
                ]}
                placeholder="Enter your email"
                placeholderTextColor={isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)'}
                value={email}
                onChangeText={validateEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: isDarkMode ? '#BBBBBB' : '#666666' }]}>Password</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
                    color: isDarkMode ? '#FFFFFF' : '#333333',
                    borderColor: errors.password ? '#FF6B6B' : isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                  }
                ]}
                placeholder="Create a password"
                placeholderTextColor={isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)'}
                secureTextEntry
                value={password}
                onChangeText={validatePassword}
              />
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: isDarkMode ? '#BBBBBB' : '#666666' }]}>Date of Birth</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
                    color: isDarkMode ? '#FFFFFF' : '#333333',
                    borderColor: errors.dob ? '#FF6B6B' : isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                  }
                ]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)'}
                value={dob}
                onChangeText={validateDob}
              />
              {errors.dob ? <Text style={styles.errorText}>{errors.dob}</Text> : null}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: isDarkMode ? '#BBBBBB' : '#666666' }]}>Gender</Text>
              <View style={[
                styles.pickerContainer,
                { 
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                }
              ]}>
                <Picker
                  selectedValue={gender}
                  style={[
                    styles.picker,
                    { color: isDarkMode ? '#FFFFFF' : '#333333' }
                  ]}
                  dropdownIconColor={isDarkMode ? '#FFFFFF' : '#333333'}
                  onValueChange={(itemValue) => setGender(itemValue)}
                >
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.registerButton,
                { opacity: isLoading ? 0.7 : 1 }
              ]} 
              onPress={handleRegister}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#4776E6', '#8E54E9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.registerButtonText}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setIsLogin(true)}>
              <Text style={[styles.switchText, { color: isDarkMode ? '#8E54E9' : '#4776E6' }]}>
                Already have an account? Sign in
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  formContainer: {
    width: width * 0.9,
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
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
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    marginTop: -7,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  registerButton: {
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
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  switchText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default RegisterScreen;