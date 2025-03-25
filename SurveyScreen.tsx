import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch,TextInput } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SurveyScreen = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [socialMedia, setSocialMedia] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: ''
  });
  const [appAccess, setAppAccess] = useState({
    contacts: false,
    gallery: false,
    camera: false,
    location: false
  });
  const [notificationAccess, setNotificationAccess] = useState(false);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSocialMediaChange = (platform, value) => {
    setSocialMedia(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const toggleAppAccess = (app) => {
    setAppAccess(prev => ({
      ...prev,
      [app]: !prev[app]
    }));
  };

  return (
    <LinearGradient colors={['#1A1A2E', '#16213E']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Setup Your Preferences</Text>
        <Text style={styles.stepIndicator}>Step {currentStep} of 3</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${(currentStep / 3) * 100}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Connect Your Social Media</Text>
            <Text style={styles.stepDescription}>Add your social media profiles to enhance your experience</Text>
            
            {Object.keys(socialMedia).map(platform => (
              <View key={platform} style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </Text>
                <View style={styles.inputWrapper}>
                  <Icon name="link" size={20} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder={`Enter your ${platform} URL`}
                    value={socialMedia[platform]}
                    onChangeText={(text) => handleSocialMediaChange(platform, text)}
                    keyboardType="url"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>App Access Permissions</Text>
            <Text style={styles.stepDescription}>Select which apps you want to integrate</Text>
            
            {Object.keys(appAccess).map(app => (
              <View key={app} style={styles.permissionItem}>
                <View style={styles.permissionText}>
                  <Icon 
                    name={
                      app === 'contacts' ? 'contacts' :
                      app === 'gallery' ? 'photo-library' :
                      app === 'camera' ? 'camera-alt' : 'location-on'
                    } 
                    size={24} 
                    color="#8E54E9" 
                  />
                  <Text style={styles.permissionLabel}>
                    {app.charAt(0).toUpperCase() + app.slice(1)}
                  </Text>
                </View>
                <Switch
                  value={appAccess[app]}
                  onValueChange={() => toggleAppAccess(app)}
                  trackColor={{ false: '#767577', true: '#8E54E9' }}
                  thumbColor={appAccess[app] ? '#f4f3f4' : '#f4f3f4'}
                />
              </View>
            ))}
          </View>
        )}

        {currentStep === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Notification Access</Text>
            <Text style={styles.stepDescription}>Allow us to manage your notifications for better organization</Text>
            
            <View style={styles.notificationContainer}>
              <Icon name="notifications" size={60} color="#8E54E9" />
              <Text style={styles.notificationText}>
                Enable notification access to organize and prioritize your alerts
              </Text>
              
              <View style={styles.permissionItem}>
                <Text style={styles.permissionLabel}>Allow Notification Access</Text>
                <Switch
                  value={notificationAccess}
                  onValueChange={() => setNotificationAccess(!notificationAccess)}
                  trackColor={{ false: '#767577', true: '#8E54E9' }}
                  thumbColor={notificationAccess ? '#f4f3f4' : '#f4f3f4'}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-back" size={24} color="#FFF" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.nextButton} 
          onPress={handleNext}
          disabled={currentStep === 3 && !notificationAccess}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === 3 ? 'Complete Setup' : 'Continue'}
          </Text>
          <Icon name="arrow-forward" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  stepIndicator: {
    fontSize: 16,
    color: '#888',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginBottom: 30,
  },
  progress: {
    height: '100%',
    backgroundColor: '#8E54E9',
    borderRadius: 2,
  },
  content: {
    flexGrow: 1,
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  stepDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    color: '#FFF',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213E',
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#FFF',
  },
  permissionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#16213E',
  },
  permissionText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  permissionLabel: {
    color: '#FFF',
    marginLeft: 15,
    fontSize: 16,
  },
  notificationContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  notificationText: {
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  backButtonText: {
    color: '#FFF',
    marginLeft: 5,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8E54E9',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  nextButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default SurveyScreen;