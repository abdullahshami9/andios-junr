// RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, Appearance } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import SQLite from 'react-native-sqlite-storage';

const RegisterScreen = ({ setIsLogin }: { setIsLogin: (isLogin: boolean) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');

  // Use Appearance to detect the color scheme
  const colorScheme = Appearance.getColorScheme(); // 'light' or 'dark'
  const isDarkMode = colorScheme === 'dark';

  const handleRegister = () => {
    if (!email || !password || !dob || !gender) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    SQLite.openDatabase({ name: 'AppLockDB', location: 'default' }, (db) => {
      db.transaction((tx) => {
        tx.executeSql(
            'INSERT INTO users (email, password, dob, gender) VALUES (?, ?, ?, ?)',
            [email, password, dob, gender],
            () => {
              Alert.alert('Success', 'Registered successfully');
              setIsLogin(true);
            },
            (_, error) => {
              console.error('Registration failed:', error); // Log the error
              Alert.alert('Error', 'Registration failed');
              return true;
            }
          );
      });
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter }]}>
      <Text style={[styles.title, { color: isDarkMode ? Colors.white : Colors.black }]}>Register</Text>
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
      <TextInput
        style={[styles.input, { color: isDarkMode ? Colors.white : Colors.black, borderColor: isDarkMode ? Colors.white : Colors.black }]}
        placeholder="Date of Birth (YYYY-MM-DD)"
        placeholderTextColor={isDarkMode ? Colors.light : Colors.dark}
        value={dob}
        onChangeText={setDob}
      />
      <Picker
        selectedValue={gender}
        style={[styles.picker, { color: isDarkMode ? Colors.white : Colors.black }]}
        onValueChange={(itemValue) => setGender(itemValue)}
      >
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
        <Picker.Item label="Other" value="Other" />
      </Picker>
      <Button title="Register" onPress={handleRegister} />
      <TouchableOpacity onPress={() => setIsLogin(true)}>
        <Text style={[styles.switchText, { color: isDarkMode ? Colors.white : Colors.black }]}>Switch to Login</Text>
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
  picker: {
    height: 40,
    marginBottom: 10,
  },
  switchText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#007BFF',
  },
};

export default RegisterScreen;