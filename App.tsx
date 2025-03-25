import React, { useState } from 'react';
import { View, StatusBar, Appearance } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import LockScreen from './LockScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import MediumScreen from './MediumScreen';

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [showMedium, setShowMedium] = useState(false);

  const colorScheme = Appearance.getColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleLoginSuccess = () => {
    setShowMedium(true);
  };

  const handleLockScreen = () => {
    setIsLocked(true);
    setShowMedium(false);
  };

  return (
    <View style={[backgroundStyle, { flex: 1 }]}>
      {isLocked ? (
        <LockScreen setIsLocked={setIsLocked} />
      ) : showMedium ? (
        <MediumScreen setIsLocked={handleLockScreen} />
      ) : (
        <>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          {isLogin ? (
            <LoginScreen setIsLocked={handleLoginSuccess} setIsLogin={setIsLogin} />
          ) : (
            <RegisterScreen setIsLogin={setIsLogin} />
          )}
        </>
      )}
    </View>
  );
};

export default App;