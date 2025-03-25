import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, Animated } from 'react-native';
import { styles } from './MediumScreenStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const AppsTab = ({ apps, isDarkMode, fadeAnim, slideAnim }) => {
  const renderAppItem = ({ item }) => {
    return (
      <Animated.View
        style={[
          styles.appItem,
          {
            opacity: fadeAnim,
            transform: [
              { scale: fadeAnim },
              { translateY: slideAnim }
            ]
          }
        ]}
      >
        <View style={styles.appItemContainer}>
          <TouchableOpacity 
            style={styles.appButton}
            onPress={() => Alert.alert('App Launch', `Opening ${item.name}${item.locked ? ' (Locked)' : ''}`)}
          >
            <Image source={{ uri: item.icon }} style={styles.appIcon} />
            {item.locked && (
              <View style={styles.lockIconContainer}>
                <Icon name="lock" size={14} color="#FFFFFF" />
              </View>
            )}
            <Text style={[styles.appName, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
              {item.name}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.appMenuButton}
            onPress={() => Alert.alert('App Settings', `Configure ${item.name}`)}
          >
            <Icon name="more-vert" size={18} color={isDarkMode ? '#BBBBBB' : '#666666'} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <FlatList
      key="apps"
      data={apps}
      renderItem={renderAppItem}
      keyExtractor={item => item.id}
      numColumns={3}
      contentContainerStyle={styles.appGrid}
      showsVerticalScrollIndicator={false}
    />
  );
};