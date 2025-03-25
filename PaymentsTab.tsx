import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { styles } from './MediumScreenStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const PaymentsTab = ({ 
  paymentMethods, 
  transactions, 
  isDarkMode, 
  setDefaultPaymentMethod 
}) => {
  const renderPaymentMethodItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={[
          styles.paymentMethodItem,
          { 
            backgroundColor: isDarkMode 
              ? 'rgba(30, 30, 50, 0.8)'
              : 'rgba(255, 255, 255, 0.9)',
          }
        ]}
        onPress={() => setDefaultPaymentMethod(item.id)}
      >
        <View style={styles.paymentMethodContent}>
          <Image source={{ uri: item.icon }} style={styles.paymentIcon} />
          <View style={styles.paymentDetails}>
            <Text style={[styles.paymentName, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
              {item.name}
            </Text>
            <Text style={[styles.paymentInfo, { color: isDarkMode ? '#BBBBBB' : '#666666' }]}>
              {item.last4 ? `•••• ${item.last4}` : item.email || ''}
            </Text>
          </View>
          {item.default && (
            <View style={[styles.defaultBadge, { backgroundColor: isDarkMode ? '#8E54E9' : '#4776E6' }]}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderTransactionItem = ({ item }) => {
    return (
      <View 
        style={[
          styles.transactionItem,
          { 
            backgroundColor: isDarkMode 
              ? 'rgba(30, 30, 50, 0.6)'
              : 'rgba(255, 255, 255, 0.7)',
          }
        ]}
      >
        <View style={styles.transactionDetails}>
          <Text style={[styles.merchantName, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
            {item.merchant}
          </Text>
          <Text style={[styles.transactionCategory, { color: isDarkMode ? '#BBBBBB' : '#666666' }]}>
            {item.category} • {item.date}
          </Text>
        </View>
        <Text style={[styles.transactionAmount, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
          {item.amount}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.paymentsContainer}>
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#333333' }]}>
        Payment Methods
      </Text>
      <FlatList
        key="paymentMethods"
        data={paymentMethods}
        renderItem={renderPaymentMethodItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.paymentMethodsList}
        showsVerticalScrollIndicator={false}
      />
      
      <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFFFFF' : '#333333', marginTop: 20 }]}>
        Recent Transactions
      </Text>
      <FlatList
        key="transactions"
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.transactionsList}
        showsVerticalScrollIndicator={false}
      />
      
      <TouchableOpacity 
        style={[styles.addButton, { backgroundColor: isDarkMode ? '#8E54E9' : '#4776E6' }]}
        onPress={() => Alert.alert('Add Payment Method', 'This would open a form to add a new payment method.')}
      >
        <Icon name="add" size={24} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add Payment Method</Text>
      </TouchableOpacity>
    </View>
  );
};