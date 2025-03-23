import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, Appearance } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import LockScreen from './LockScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

const Stack = createStackNavigator();

const App = () => {
  const colorScheme = Appearance.getColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <NavigationContainer>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? Colors.darker : Colors.lighter}
      />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
          },
          headerTintColor: isDarkMode ? Colors.white : Colors.black,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ title: 'Sign In' }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{ title: 'Create Account' }}
        />
        <Stack.Screen 
          name="LockScreen" 
          component={LockScreen}
          options={{ 
            headerShown: false,
            gestureEnabled: false 
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;