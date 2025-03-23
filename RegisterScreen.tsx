// RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, Appearance, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import SQLite from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RegisterScreen = ({ setIsLogin, navigation }: { setIsLogin: (isLogin: boolean) => void, navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    dob: ''
  });

  // Use Appearance to detect the color scheme
  const colorScheme = Appearance.getColorScheme(); // 'light' or 'dark'
  const isDarkMode = colorScheme === 'dark';

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      return false;
    }
    if (!emailRegex.test(email)) {
      setErrors(prev => ({ ...prev, email: 'Invalid email format' }));
      return false;
    }
    setErrors(prev => ({ ...prev, email: '' }));
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setErrors(prev => ({ ...prev, password: 'Password is required' }));
      return false;
    }
    if (password.length < 6) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      return false;
    }
    setErrors(prev => ({ ...prev, password: '' }));
    return true;
  };

  const validateDob = (dob: string) => {
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dob) {
      setErrors(prev => ({ ...prev, dob: 'Date of birth is required' }));
      return false;
    }
    if (!dobRegex.test(dob)) {
      setErrors(prev => ({ ...prev, dob: 'Invalid date format (YYYY-MM-DD)' }));
      return false;
    }
    setErrors(prev => ({ ...prev, dob: '' }));
    return true;
  };

  const handleRegister = () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isDobValid = validateDob(dob);

    if (!isEmailValid || !isPasswordValid || !isDobValid) {
      return;
    }

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
                  Alert.alert('Success', 'Registered successfully');
                  setIsLogin(true);
                  navigation.replace('LockScreen');
                },
                (_, error) => {
                  console.error('Registration failed:', error);
                  Alert.alert('Error', 'Registration failed. Please try again.');
                  return true;
                }
              );
            },
            (_, error) => {
              console.error('Table creation failed:', error);
              Alert.alert('Error', 'Database error. Please try again.'); 
              return true;
            }
          );
        });
      },
      (error) => {
        console.error('Database open error:', error);
        Alert.alert('Error', 'Database connection failed. Please try again.');
      }
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter }]}>
      <View style={styles.header}>
        <Icon name="account-circle" size={80} color="#4285F4" />
        <Text style={[styles.title, { color: isDarkMode ? Colors.white : Colors.black }]}>Create Account</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Icon name="email" size={24} color="#757575" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: isDarkMode ? Colors.white : Colors.black, borderColor: isDarkMode ? Colors.white : Colors.black }]}
            placeholder="Email"
            placeholderTextColor={isDarkMode ? Colors.light : Colors.dark}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validateEmail(text);
            }}
            keyboardType="email-address"
          />
        </View>
        {errors.email ? <Text style={[styles.errorText, { color: isDarkMode ? Colors.white : Colors.black }]}>{errors.email}</Text> : null}

        <View style={styles.inputContainer}>
          <Icon name="lock" size={24} color="#757575" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: isDarkMode ? Colors.white : Colors.black, borderColor: isDarkMode ? Colors.white : Colors.black }]}
            placeholder="Password"
            placeholderTextColor={isDarkMode ? Colors.light : Colors.dark}
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validatePassword(text);
            }}
          />
        </View>
        {errors.password ? <Text style={[styles.errorText, { color: isDarkMode ? Colors.white : Colors.black }]}>{errors.password}</Text> : null}

        <View style={styles.inputContainer}>
          <Icon name="cake" size={24} color="#757575" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: isDarkMode ? Colors.white : Colors.black, borderColor: isDarkMode ? Colors.white : Colors.black }]}
            placeholder="Date of Birth (YYYY-MM-DD)"
            placeholderTextColor={isDarkMode ? Colors.light : Colors.dark}
            value={dob}
            onChangeText={(text) => {
              setDob(text);
              validateDob(text);
            }}
          />
        </View>
        {errors.dob ? <Text style={[styles.errorText, { color: isDarkMode ? Colors.white : Colors.black }]}>{errors.dob}</Text> : null}

        <Picker
          selectedValue={gender}
          style={[styles.picker, { color: isDarkMode ? Colors.white : Colors.black }]}
          onValueChange={(itemValue) => setGender(itemValue)}
        >
          <Picker.Item label="Male" value="Male" />
          <Picker.Item label="Female" value="Female" />
          <Picker.Item label="Other" value="Other" />
        </Picker>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={[styles.registerButtonText, { color: isDarkMode ? Colors.white : Colors.black }]}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.switchButton} onPress={() => setIsLogin(true)}>
          <Text style={[styles.switchButtonText, { color: isDarkMode ? Colors.white : Colors.black }]}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#202124',
    marginTop: 16,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dadce0',
    borderRadius: 4,
    marginBottom: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#202124',
  },
  errorText: {
    color: '#d93025',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  registerButton: {
    backgroundColor: '#4285F4',
    borderRadius: 4,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  switchButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#4285F4',
    fontSize: 14,
    fontWeight: '500',
  },
  picker: {
    height: 50,
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
};

export default RegisterScreen;