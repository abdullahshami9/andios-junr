import React, { useState } from 'react';
import { View, StatusBar, Appearance } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import LockScreen from './LockScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

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
          {isLogin ? (
            <LoginScreen setIsLocked={setIsLocked} setIsLogin={setIsLogin} />
          ) : (
            <RegisterScreen setIsLogin={setIsLogin} />
          )}
        </>
      )}
    </View>
  );
};

export default App;