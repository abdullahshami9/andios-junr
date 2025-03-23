import React, { useState } from 'react';
import { View, StatusBar, Appearance } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import LockScreen from './screens/LockScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLocked, setIsLocked] = useState(false); // Set to false initially

  const colorScheme = Appearance.getColorScheme(); // Use Appearance as fallback
  const isDarkMode = colorScheme === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View style={[backgroundStyle, { flex: 1 }]}>
      {isLocked ? (
        <LockScreen setIsLocked={setIsLocked} />
      ) : (
        <>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <Stack.Navigator>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen 
              name="LockScreen" 
              component={LockScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </>
      )}
    </View>
  );
};

export default App;