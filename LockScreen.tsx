// LockScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Appearance } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const LockScreen = ({ setIsLocked }: { setIsLocked: (locked: boolean) => void }) => {
  const [lockPassword, setLockPassword] = useState('');

  // Use Appearance to detect the color scheme
  const colorScheme = Appearance.getColorScheme(); // 'light' or 'dark'
  const isDarkMode = colorScheme === 'dark';

  const unlockApp = () => {
    if (lockPassword === '1234') {
      setIsLocked(false);
    } else {
      Alert.alert('Error', 'Wrong password');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? Colors.darker : Colors.lighter }]}>
      <Text style={[styles.title, { color: isDarkMode ? Colors.white : Colors.black }]}>App Locked</Text>
      <TextInput
        style={[styles.input, { color: isDarkMode ? Colors.white : Colors.black, borderColor: isDarkMode ? Colors.white : Colors.black }]}
        placeholder="Enter Password"
        placeholderTextColor={isDarkMode ? Colors.light : Colors.dark}
        secureTextEntry
        value={lockPassword}
        onChangeText={setLockPassword}
      />
      <Button title="Unlock" onPress={unlockApp} />
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
};

export default LockScreen;