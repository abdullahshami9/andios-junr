import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Switch, 
  TextInput, 
  Image, 
  PermissionsAndroid,
  Alert,
  Appearance
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Camera } from 'react-native-vision-camera';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

const colorScheme = Appearance.getColorScheme();
const isDarkMode = colorScheme === 'dark';

const NavigationFooter = ({ 
  currentStep, 
  handleBack, 
  handleNext, 
  isDarkMode,
  totalSteps 
}) => {
  const styles = {
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 200,
      backgroundColor: 'transparent',
    },
    navButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 16,
    },
    lightNavButton: {
      borderColor: '#E0E0E0',
      backgroundColor: '#FFF',
    },
    darkNavButton: {
      borderColor: '#444',
      backgroundColor: '#16213E',
    },
    disabledNavButton: {
      borderColor: '#CCCCCC',
    },
    completeButton: {
      borderColor: '#4CAF50',
    },
  };

  return (
    <View style={styles.footer}>
      {/* Back Button */}
      <TouchableOpacity
        style={[
          styles.navButton,
          currentStep === 1 && styles.disabledNavButton,
          isDarkMode ? styles.darkNavButton : styles.lightNavButton
        ]}
        onPress={handleBack}
        disabled={currentStep === 1}
      >
        <Icon
          name="arrow-back"
          size={24}
          color={currentStep === 1 ?
            (isDarkMode ? '#555' : '#AAA') :
            (isDarkMode ? '#FFF' : '#000')}
        />
      </TouchableOpacity>
      
      {/* Forward/Complete Button */}
      <TouchableOpacity
        style={[
          styles.navButton,
          isDarkMode ? styles.darkNavButton : styles.lightNavButton,
          currentStep === totalSteps && styles.completeButton
        ]}
        onPress={handleNext}
      >
        <Icon
          name={currentStep === totalSteps ? 'check' : 'arrow-forward'}
          size={24}
          color={
            currentStep === totalSteps 
              ? '#4CAF50' 
              : (isDarkMode ? '#FFF' : '#000')
          }
        />
      </TouchableOpacity>
    </View>
  );
};

const RaabtaSurveyScreen = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [socialMediaLinks, setSocialMediaLinks] = useState({});
  const [audioSetup, setAudioSetup] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [fileAccessPermission, setFileAccessPermission] = useState(false);
  const [micPermission, setMicPermission] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordURI, setRecordURI] = useState('');

  const platforms = [
    { name: 'Facebook', icon: require('./assets/icons/facebook.png') },
    { name: 'Twitter', icon: require('./assets/icons/x.png') },
    { name: 'Instagram', icon: require('./assets/icons/instagram.png') },
    { name: 'LinkedIn', icon: require('./assets/icons/linkedin.png') },
    { name: 'GitHub', icon: require('./assets/icons/github.png') },
    { name: 'YouTube', icon: require('./assets/icons/youtube.png') },
    { name: 'TikTok', icon: require('./assets/icons/tiktok.png') },
    { name: 'Website', icon: require('./assets/icons/website.png') },
  ];

  useEffect(() => {
    checkMicPermission();
  }, []);

  const checkMicPermission = async () => {
    try {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );
      setMicPermission(granted);
      return granted;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const requestMicPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'Raabta needs access to your microphone for voice activation',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
      setMicPermission(isGranted);
      return isGranted;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const onStartRecord = async () => {
    if (!micPermission) {
      const granted = await requestMicPermission();
      if (!granted) return;
    }

    try {
      const audioPath = await audioRecorderPlayer.startRecorder();
      setIsRecording(true);
      setRecordURI(audioPath);
    } catch (error) {
      console.error('Recording error:', error);
    }
  };

  const onStopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setIsRecording(false);
      console.log('Recording saved at:', result);
    } catch (error) {
      console.error('Stop recording error:', error);
    }
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      // Step validations
      if (currentStep === 1 && !audioSetup) {
        Alert.alert('Audio Setup Required', 'Please enable voice activation to continue');
        return;
      }
      
      if (currentStep === 2 && selectedPlatforms.length === 0) {
        Alert.alert('Platforms Required', 'Please select at least one platform');
        return;
      }

      if (currentStep === 3) {
        // Request camera and file access permissions
        try {
          const cameraStatus = await Camera.requestCameraPermission();
          const fileStatus = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
          );

          setCameraPermission(cameraStatus === 'authorized');
          setFileAccessPermission(fileStatus === PermissionsAndroid.RESULTS.GRANTED);
        } catch (error) {
          console.error('Permission error:', error);
        }
      }

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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, isDarkMode ? styles.darkText : styles.lightText]}>
              Audio Setup
            </Text>
            <Text style={[styles.stepDescription, isDarkMode ? styles.darkSubtext : styles.lightSubtext]}>
              Set up voice activation like "Ok Raabta"
            </Text>
            
            <View style={[styles.audioSetupContainer, isDarkMode ? styles.darkCard : styles.lightCard]}>
              <Switch
                value={audioSetup}
                onValueChange={setAudioSetup}
                trackColor={{ false: '#767577', true: '#8E54E9' }}
                thumbColor={audioSetup ? '#f4f3f4' : '#f4f3f4'}
              />
              <Text style={[styles.audioSetupText, isDarkMode ? styles.darkText : styles.lightText]}>
                Enable "Ok Raabta" Voice Activation
              </Text>
            </View>

            {audioSetup && (
              <View style={[styles.recordingContainer, isDarkMode ? styles.darkCard : styles.lightCard]}>
                <Text style={[styles.recordingTitle, isDarkMode ? styles.darkText : styles.lightText]}>
                  Record your activation phrase
                </Text>
                <Text style={[styles.recordingSubtitle, isDarkMode ? styles.darkSubtext : styles.lightSubtext]}>
                  Say "Junior" clearly into your microphone
                </Text>
                
                <TouchableOpacity 
                  style={[styles.recordButton, isRecording && styles.recordingButton]}
                  onPress={isRecording ? onStopRecord : onStartRecord}
                >
                  <Icon 
                    name={isRecording ? 'stop' : 'mic'} 
                    size={30} 
                    color={isDarkMode ? '#FFF' : '#000'} 
                  />
                  <Text style={[styles.recordButtonText, isDarkMode ? styles.darkText : styles.lightText]}>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Text>
                </TouchableOpacity>
                
                {recordURI && !isRecording && (
                  <TouchableOpacity 
                    style={styles.playButton}
                    onPress={() => audioRecorderPlayer.startPlayer(recordURI)}
                  >
                    <Icon name="play-arrow" size={30} color="#8E54E9" />
                    <Text style={[styles.playButtonText, isDarkMode ? styles.darkText : styles.lightText]}>
                      Play Recording
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, isDarkMode ? styles.darkText : styles.lightText]}>
              Access to
            </Text>
            
            <View style={styles.platformGridContainer}>
              {platforms.map((platform, index) => (
                <View 
                  key={platform.name} 
                  style={[
                    styles.platformGridItem,
                    index % 4 !== 3 && styles.platformGridItemSpacing
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.platformButton,
                      isDarkMode ? styles.darkCard : styles.lightCard,
                      selectedPlatforms.includes(platform.name) && styles.selectedPlatform
                    ]}
                    onPress={() => {
                      setSelectedPlatforms(prev => 
                        prev.includes(platform.name)
                          ? prev.filter(p => p !== platform.name)
                          : [...prev, platform.name]
                      );
                    }}
                  >
                    <Image source={platform.icon} style={styles.platformIcon} />
                    <Text style={[styles.platformText, isDarkMode ? styles.darkText : styles.lightText]}>
                      {platform.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, isDarkMode ? styles.darkText : styles.lightText]}>
              Notification Access
            </Text>
            <Text style={[styles.stepDescription, isDarkMode ? styles.darkSubtext : styles.lightSubtext]}>
              Allow Raabta to manage your notifications
            </Text>
            <View style={styles.permissionContainer}>
              <TouchableOpacity 
                style={[styles.permissionItem, isDarkMode ? styles.darkCard : styles.lightCard]}
                onPress={() => setNotificationPermission(!notificationPermission)}
              >
                <Icon name="notifications" size={40} color="#8E54E9" />
                <View style={styles.permissionTextContainer}>
                  <Text style={[styles.permissionTitle, isDarkMode ? styles.darkText : styles.lightText]}>
                    Notification Access
                  </Text>
                  <Text style={[styles.permissionSubtext, isDarkMode ? styles.darkSubtext : styles.lightSubtext]}>
                    Enable to organize and prioritize alerts
                  </Text>
                </View>
                <Switch
                  value={notificationPermission}
                  onValueChange={setNotificationPermission}
                  trackColor={{ false: '#767577', true: '#8E54E9' }}
                  thumbColor={notificationPermission ? '#f4f3f4' : '#f4f3f4'}
                />
              </TouchableOpacity>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={[styles.stepTitle, isDarkMode ? styles.darkText : styles.lightText]}>
              Face and File Access
            </Text>
            <Text style={[styles.stepDescription, isDarkMode ? styles.darkSubtext : styles.lightSubtext]}>
              Allow access for advanced features
            </Text>
            <View style={styles.permissionContainer}>
              <TouchableOpacity 
                style={[styles.permissionItem, isDarkMode ? styles.darkCard : styles.lightCard]}
                onPress={() => setCameraPermission(!cameraPermission)}
              >
                <Icon name="camera-alt" size={40} color="#8E54E9" />
                <View style={styles.permissionTextContainer}>
                  <Text style={[styles.permissionTitle, isDarkMode ? styles.darkText : styles.lightText]}>
                    Camera Access
                  </Text>
                  <Text style={[styles.permissionSubtext, isDarkMode ? styles.darkSubtext : styles.lightSubtext]}>
                    Enable for face recognition
                  </Text>
                </View>
                <Switch
                  value={cameraPermission}
                  onValueChange={setCameraPermission}
                  trackColor={{ false: '#767577', true: '#8E54E9' }}
                  thumbColor={cameraPermission ? '#f4f3f4' : '#f4f3f4'}
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.permissionItem, isDarkMode ? styles.darkCard : styles.lightCard]}
                onPress={() => setFileAccessPermission(!fileAccessPermission)}
              >
                <Icon name="folder" size={40} color="#8E54E9" />
                <View style={styles.permissionTextContainer}>
                  <Text style={[styles.permissionTitle, isDarkMode ? styles.darkText : styles.lightText]}>
                    File Access
                  </Text>
                  <Text style={[styles.permissionSubtext, isDarkMode ? styles.darkSubtext : styles.lightSubtext]}>
                    Enable for file management
                  </Text>
                </View>
                <Switch
                  value={fileAccessPermission}
                  onValueChange={setFileAccessPermission}
                  trackColor={{ false: '#767577', true: '#8E54E9' }}
                  thumbColor={fileAccessPermission ? '#f4f3f4' : '#f4f3f4'}
                />
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const renderProgressIndicator = () => (
    <View style={[styles.progressContainer, isDarkMode ? styles.darkProgressContainer : styles.lightProgressContainer]}>
      <View style={styles.stepIndicatorContainer}>
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            <View style={[
              styles.stepCircle, 
              currentStep === step ? styles.activeStepCircle : {},
              isDarkMode ? styles.darkStepCircle : styles.lightStepCircle
            ]}>
              <Text style={[
                styles.stepNumber, 
                currentStep === step ? styles.activeStepNumber : {}
              ]}>
                {step}
              </Text>
            </View>
            {step < 4 && (
              <View style={[
                styles.stepConnector, 
                isDarkMode ? styles.darkStepConnector : styles.lightStepConnector,
                currentStep > step && styles.activeStepConnector
              ]} />
            )}
          </React.Fragment>
        ))}
      </View>
      
      <View style={styles.stepLabelContainer}>
        <Text style={[
          styles.stepLabel, 
          isDarkMode ? styles.darkStepLabel : styles.lightStepLabel,
          currentStep === 1 && styles.activeStepLabel
        ]}>
          Audio
        </Text>
        <Text style={[
          styles.stepLabel, 
          isDarkMode ? styles.darkStepLabel : styles.lightStepLabel,
          currentStep === 2 && styles.activeStepLabel
        ]}>
          Platforms
        </Text>
        <Text style={[
          styles.stepLabel, 
          isDarkMode ? styles.darkStepLabel : styles.lightStepLabel,
          currentStep === 3 && styles.activeStepLabel
        ]}>
          Notifications
        </Text>
        <Text style={[
          styles.stepLabel, 
          isDarkMode ? styles.darkStepLabel : styles.lightStepLabel,
          currentStep === 4 && styles.activeStepLabel
        ]}>
          Permissions
        </Text>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={isDarkMode ? ['#1A1A2E', '#16213E'] : ['#E8F0FE', '#C7D2FE']}
      style={styles.gradient}
    >
      <View style={[styles.header, { paddingTop: 50 }]}>
        <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
          Junr
        </Text>
      </View>

      {renderProgressIndicator()}

      <ScrollView contentContainerStyle={styles.content}>
        {renderStepContent()}
      </ScrollView>

      <NavigationFooter 
        currentStep={currentStep}
        handleBack={handleBack}
        handleNext={handleNext}
        isDarkMode={isDarkMode}
        totalSteps={4}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    padding: 20,
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
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
    marginBottom: 10,
  },
  stepDescription: {
    fontSize: 14,
    marginBottom: 20,
  },
  
  // Light and Dark mode styles
  lightText: {
    color: '#000',
  },
  darkText: {
    color: '#FFF',
  },
  lightSubtext: {
    color: '#666',
  },
  darkSubtext: {
    color: '#AAA',
  },
  lightCard: {
    backgroundColor: '#FFF',
  },
  darkCard: {
    backgroundColor: '#16213E',
  },
  lightProgressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  darkProgressContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  lightStepCircle: {
    backgroundColor: '#E0E0E0',
    borderColor: '#CCC',
  },
  darkStepCircle: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  lightStepConnector: {
    backgroundColor: '#E0E0E0',
  },
  darkStepConnector: {
    backgroundColor: '#333',
  },
  lightStepLabel: {
    color: '#666',
  },
  darkStepLabel: {
    color: '#AAA',
  },
  lightNavButton: {
    backgroundColor: '#FFF',
  },
  darkNavButton: {
    backgroundColor: '#16213E',
  },

  // Progress indicator
  progressContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  activeStepCircle: {
    backgroundColor: '#8E54E9',
    borderColor: '#8E54E9',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  stepNumber: {
    fontWeight: 'bold',
    color: '#CCC',
  },
  activeStepNumber: {
    color: 'white',
    fontSize: 16,
  },
  stepConnector: {
    height: 2,
    width: 30,
    marginHorizontal: 5,
  },
  activeStepConnector: {
    backgroundColor: '#8E54E9',
  },
  stepLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
    flex: 1,
  },
  activeStepLabel: {
    color: '#8E54E9',
    fontWeight: 'bold',
  },

  // Navigation buttons
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  disabledNavButton: {
    opacity: 0.5,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },

  // Audio setup specific styles
  audioSetupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
  },
  audioSetupText: {
    marginLeft: 15,
    flex: 1,
  },
  recordingContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
  },
  recordingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recordingSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#8E54E9',
    marginBottom: 10,
  },
  recordingButton: {
    backgroundColor: 'rgba(142, 84, 233, 0.2)',
  },
  recordButtonText: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  playButtonText: {
    marginLeft: 10,
  },

  // Platform styles
  platformContainer: {
    paddingVertical: 20,
  },
  platformButton: {
    alignItems: 'center',
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  selectedPlatform: {
    borderWidth: 2,
    borderColor: '#8E54E9',
  },
  platformIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  platformText: {
    marginTop: 10,
  },

  // Permission styles
  permissionContainer: {
    marginTop: 20,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  permissionTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  permissionSubtext: {
    fontSize: 12,
    marginTop: 5,
  },
  platformGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 20,
  },
  platformGridItem: {
    width: '25%', // 4 items per row
    paddingBottom: 16, // spacing between rows
  },
  platformGridItemSpacing: {
    paddingRight: 8, // spacing between items
  },
  platformButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  platformIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  platformText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default RaabtaSurveyScreen;