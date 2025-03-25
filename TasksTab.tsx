import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { styles } from './MediumScreenStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const TasksTab = ({ isDarkMode }) => {
  const MOCK_TASKS = [
    { id: '1', title: 'Design new UI components', description: 'Create wireframes for the new dashboard', time: '10:00 AM', completed: false },
    { id: '2', title: 'Team meeting', description: 'Weekly sync with product team', time: '11:30 AM', completed: true },
    { id: '3', title: 'Code review', description: 'Review pull requests from junior devs', time: '2:00 PM', completed: false },
    { id: '4', title: 'Prepare presentation', description: 'Slides for investor meeting tomorrow', time: '4:45 PM', completed: false },
  ];

  const renderTaskCard = ({ item }) => {
    return (
      <View style={[
        styles.taskCard,
        {
          backgroundColor: isDarkMode 
            ? item.completed ? 'rgba(46, 204, 113, 0.2)' : 'rgba(30, 30, 50, 0.8)'
            : item.completed ? 'rgba(46, 204, 113, 0.1)' : 'rgba(255, 255, 255, 0.9)',
          borderLeftColor: item.completed ? '#2ecc71' : '#8E54E9',
          borderLeftWidth: 4,
        }
      ]}>
        <View style={styles.taskContent}>
          <View style={styles.taskHeader}>
            <Text style={[styles.taskTitle, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
              {item.title}
            </Text>
            <Text style={[styles.taskTime, { color: isDarkMode ? '#BBBBBB' : '#666666' }]}>
              {item.time}
            </Text>
          </View>
          <Text style={[styles.taskDescription, { color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }]}>
            {item.description}
          </Text>
        </View>
        <TouchableOpacity 
          style={[
            styles.taskCheckbox,
            { 
              backgroundColor: item.completed ? '#2ecc71' : 'transparent',
              borderColor: isDarkMode ? '#555' : '#D0D0D0'
            }
          ]}
          onPress={() => {}}
        >
          {item.completed && <Icon name="check" size={18} color="#FFFFFF" />}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.generalContainer}>
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
        Today's Tasks
      </Text>
      
      <FlatList
        data={MOCK_TASKS}
        renderItem={renderTaskCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.tasksList}
        showsVerticalScrollIndicator={false}
      />
      
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: isDarkMode ? '#8E54E9' : '#4776E6' }]}
        onPress={() => Alert.alert('Add Task', 'This would open a form to add a new task.')}
      >
        <Icon name="add" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add New Task</Text>
      </TouchableOpacity>
    </View>
  );
};