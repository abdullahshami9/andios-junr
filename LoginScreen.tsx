import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, Appearance } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import SQLite from 'react-native-sqlite-storage';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const colorScheme = Appearance.getColorScheme(); // Use Appearance as fallback
  const isDarkMode = colorScheme === 'dark';
  const navigation = useNavigation();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    SQLite.openDatabase({ name: 'AppLockDB', location: 'default' }, (db) => {
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM users WHERE email = ? AND password = ?',
          [email, password],
          (_, results) => {
            if (results.rows.length > 0) {
              Alert.alert('Success', 'Logged in successfully');
              navigation.replace('LockScreen');
            } else {
              Alert.alert('Error', 'Invalid credentials');
            }
          }
        );
      });
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter }]}>
      <Text style={[styles.title, { color: isDarkMode ? Colors.white : Colors.black }]}>Login</Text>
      <TextInput
        style={[styles.input, { color: isDarkMode ? Colors.white : Colors.black, borderColor: isDarkMode ? Colors.white : Colors.black }]}
        placeholder="Email"
        placeholderTextColor={isDarkMode ? Colors.light : Colors.dark}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, { color: isDarkMode ? Colors.white : Colors.black, borderColor: isDarkMode ? Colors.white : Colors.black }]}
        placeholder="Password"
        placeholderTextColor={isDarkMode ? Colors.light : Colors.dark}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={[styles.switchText, { color: isDarkMode ? Colors.white : Colors.black }]}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  switchText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#007BFF',
  },
};

export default LoginScreen;