/**
 * Calendars Maintenance Screen
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useCalendars,
  useCreateCalendar,
  useUpdateCalendar,
  useDeleteCalendar,
} from '../../../api/hooks';
import type { Calendar } from '../../../api/services/calendars.service';
import { LoadingSpinner, ErrorView, EmptyState, FormModal, FormInput, ListItem } from '../../../components/common';

export function CalendarsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState<Calendar | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const { data: calendars = [], isLoading, error, refetch } = useCalendars();
  const createMutation = useCreateCalendar();
  const updateMutation = useUpdateCalendar();
  const deleteMutation = useDeleteCalendar();

  const handleOpenModal = (calendar?: Calendar) => {
    if (calendar) {
      setEditingCalendar(calendar);
      setFormData({
        name: calendar.name,
        description: calendar.description || '',
      });
    } else {
      setEditingCalendar(null);
      setFormData({
        name: '',
        description: '',
      });
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingCalendar(null);
    setFormData({
      name: '',
      description: '',
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    try {
      if (editingCalendar) {
        await updateMutation.mutateAsync({
          id: editingCalendar.id,
          data: {
            name: formData.name,
            description: formData.description || undefined,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          description: formData.description || undefined,
        });
      }
      handleCloseModal();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save calendar');
    }
  };

  const handleDelete = (calendar: Calendar) => {
    Alert.alert(
      'Delete Calendar',
      `Are you sure you want to delete "${calendar.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(calendar.id);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete calendar');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading calendars..." />;
  }

  if (error) {
    return <ErrorView message={error.message || 'Failed to load calendars'} onRetry={refetch} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendars</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleOpenModal()}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {calendars.length === 0 ? (
        <EmptyState
          message="No calendars found"
          actionLabel="Add Calendar"
          onAction={() => handleOpenModal()}
        />
      ) : (
        <FlatList
          data={calendars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListItem
              title={item.name}
              subtitle={`${item.days.length} day(s) | ${item.description || 'No description'}`}
              onEdit={() => handleOpenModal(item)}
              onDelete={() => handleDelete(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      <FormModal
        visible={modalVisible}
        title={editingCalendar ? 'Edit Calendar' : 'Create Calendar'}
        onClose={handleCloseModal}
        onSave={handleSave}
        isLoading={createMutation.isPending || updateMutation.isPending}
      >
        <FormInput
          label="Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter calendar name"
        />
        <FormInput
          label="Description (Optional)"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Enter description"
          multiline
          numberOfLines={3}
        />
        <Text style={styles.note}>
          Note: Calendar days can be managed after creating the calendar.
        </Text>
      </FormModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 8,
  },
  note: {
    fontSize: 12,
    color: '#757575',
    fontStyle: 'italic',
    marginTop: 8,
  },
});

