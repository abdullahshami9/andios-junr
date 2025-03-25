import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { styles } from './MediumScreenStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const NotificationsTab = ({ 
  notifications, 
  expandedNotification, 
  isDarkMode, 
  expandNotification, 
  collapseNotification 
}) => {
  const renderNotificationItem = ({ item }) => {
    const isExpanded = expandedNotification === item.id;
    
    return (
      <TouchableOpacity 
        style={[
          styles.notificationItem, 
          { 
            backgroundColor: isDarkMode 
              ? item.read ? 'rgba(30, 30, 50, 0.6)' : 'rgba(30, 30, 50, 0.8)' 
              : item.read ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.9)',
          }
        ]}
        onPress={() => isExpanded ? collapseNotification() : expandNotification(item)}
      >
        <View style={styles.notificationHeader}>
          <Text style={[styles.notificationTitle, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
            {item.title}
          </Text>
          <Text style={[styles.notificationTime, { color: isDarkMode ? '#BBBBBB' : '#666666' }]}>
            {item.time}
          </Text>
        </View>
        
        <Text 
          style={[
            styles.notificationContent, 
            { 
              color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
              height: isExpanded ? 'auto' : 20,
            }
          ]}
          numberOfLines={isExpanded ? undefined : 1}
        >
          {item.content}
        </Text>
        
        {isExpanded && (
          <View style={styles.notificationActions}>
            <TouchableOpacity style={styles.notificationAction}>
              <Text style={[styles.actionText, { color: isDarkMode ? '#8E54E9' : '#4776E6' }]}>
                Reply
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationAction}>
              <Text style={[styles.actionText, { color: isDarkMode ? '#8E54E9' : '#4776E6' }]}>
                Mark as Read
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      key="notifications"
      data={notifications}
      renderItem={renderNotificationItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.notificationList}
      showsVerticalScrollIndicator={false}
    />
  );
};