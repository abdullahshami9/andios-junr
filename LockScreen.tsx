import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, Appearance } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import SQLite from 'react-native-sqlite-storage';

const LockScreen = ({ setIsLocked }: { setIsLocked: (locked: boolean) => void }) => {
  const [lockPassword, setLockPassword] = useState('');
  const [db, setDb] = useState(null);

  const colorScheme = Appearance.getColorScheme();
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    SQLite.openDatabase(
      { name: 'AppLockDB', location: 'default' },
      (db) => {
        setDb(db); // Initialize the database
      },
      (error) => {
        console.error('Database open error:', error);
      }
    );
  }, []);

  const unlockApp = () => {
    if (lockPassword === '1234') {
      setIsLocked(false);
    } else {
      Alert.alert('Error', 'Wrong password');
    }
  };

  const fetchData = () => {
    if (db) { // Ensure the database is initialized
      db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM users',
          [],
          (_, results) => {
            console.log('Data fetched:', results.rows.raw());
          },
          (_, error) => {
            console.error('Error fetching data:', error);
          }
        );
      });
    } else {
      console.error('Database is not initialized');
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
      <Button title="Fetch Data" onPress={fetchData} />
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