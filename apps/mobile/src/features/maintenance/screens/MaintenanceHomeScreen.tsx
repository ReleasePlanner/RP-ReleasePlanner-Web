/**
 * Maintenance Home Screen
 * Lists all maintenance options
 */
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { MaintenanceStackParamList } from '../../../navigation/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type MaintenanceNavigationProp = NativeStackNavigationProp<MaintenanceStackParamList>;

interface MaintenanceOption {
  id: string;
  title: string;
  screen: keyof MaintenanceStackParamList;
  description: string;
}

const maintenanceOptions: MaintenanceOption[] = [
  {
    id: 'basePhases',
    title: 'Base Phases',
    screen: 'BasePhases',
    description: 'Manage base phases',
  },
  {
    id: 'products',
    title: 'Products',
    screen: 'Products',
    description: 'Manage products and components',
  },
  {
    id: 'features',
    title: 'Features',
    screen: 'Features',
    description: 'Manage features',
  },
  {
    id: 'calendars',
    title: 'Calendars',
    screen: 'Calendars',
    description: 'Manage calendars and calendar days',
  },
  {
    id: 'itOwners',
    title: 'IT Owners',
    screen: 'ITOwners',
    description: 'Manage IT owners',
  },
];

export function MaintenanceHomeScreen() {
  const navigation = useNavigation<MaintenanceNavigationProp>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Maintenance</Text>
      </View>
      <FlatList
        data={maintenanceOptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Text style={styles.optionTitle}>{item.title}</Text>
            <Text style={styles.optionDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  optionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  optionDescription: {
    fontSize: 14,
    color: '#757575',
  },
});

