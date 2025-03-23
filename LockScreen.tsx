import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import InstalledApps from 'react-native-installed-apps';

interface AppInfo {
  appName: string;
  packageName: string;
  icon: string;
}

const LockScreen = () => {
  const [installedApps, setInstalledApps] = useState<AppInfo[]>([]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      InstalledApps.getApps()
        .then((apps) => {
          setInstalledApps(apps);
        })
        .catch((error) => {
          console.error('Error fetching installed apps:', error);
        });
    }
  }, []);

  const renderAppItem = ({ item }: { item: AppInfo }) => (
    <TouchableOpacity style={styles.appItem}>
      <Image source={{ uri: item.icon }} style={styles.appIcon} />
      <Text style={styles.appName} numberOfLines={1}>
        {item.appName}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Apps</Text>
      </View>
      <FlatList
        data={installedApps}
        renderItem={renderAppItem}
        keyExtractor={(item) => item.packageName}
        numColumns={4}
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    height: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 16,
    elevation: 2,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#202124',
  },
  gridContainer: {
    padding: 16,
  },
  appItem: {
    width: (Dimensions.get('window').width - 32) / 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  appName: {
    marginTop: 4,
    fontSize: 12,
    color: '#202124',
    textAlign: 'center',
  },
});

export default LockScreen;