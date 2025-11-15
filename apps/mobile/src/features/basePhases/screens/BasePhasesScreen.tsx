/**
 * Base Phases Maintenance Screen
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useBasePhases,
  useCreateBasePhase,
  useUpdateBasePhase,
  useDeleteBasePhase,
} from '../../../api/hooks';
import type { BasePhase } from '../../../api/services/basePhases.service';
import { LoadingSpinner, ErrorView, EmptyState, FormModal, FormInput, ListItem } from '../../../components/common';

export function BasePhasesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPhase, setEditingPhase] = useState<BasePhase | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#1976D2',
  });

  const { data: phases = [], isLoading, error, refetch } = useBasePhases();
  const createMutation = useCreateBasePhase();
  const updateMutation = useUpdateBasePhase();
  const deleteMutation = useDeleteBasePhase();

  const handleOpenModal = (phase?: BasePhase) => {
    if (phase) {
      setEditingPhase(phase);
      setFormData({
        name: phase.name,
        color: phase.color,
      });
    } else {
      setEditingPhase(null);
      setFormData({
        name: '',
        color: '#1976D2',
      });
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingPhase(null);
    setFormData({
      name: '',
      color: '#1976D2',
      category: '',
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    try {
      if (editingPhase) {
        await updateMutation.mutateAsync({
          id: editingPhase.id,
          data: {
            name: formData.name,
            color: formData.color,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          color: formData.color,
        });
      }
      handleCloseModal();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save phase');
    }
  };

  const handleDelete = (phase: BasePhase) => {
    Alert.alert(
      'Delete Phase',
      `Are you sure you want to delete "${phase.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(phase.id);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete phase');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading phases..." />;
  }

  if (error) {
    return <ErrorView message={error.message || 'Failed to load phases'} onRetry={refetch} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Base Phases</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleOpenModal()}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {phases.length === 0 ? (
        <EmptyState
          message="No phases found"
          actionLabel="Add Phase"
          onAction={() => handleOpenModal()}
        />
      ) : (
        <FlatList
          data={phases}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListItem
              title={item.name}
              subtitle={item.color}
              rightContent={
                <View
                  style={[styles.colorIndicator, { backgroundColor: item.color }]}
                />
              }
              onEdit={() => handleOpenModal(item)}
              onDelete={() => handleDelete(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      <FormModal
        visible={modalVisible}
        title={editingPhase ? 'Edit Phase' : 'Create Phase'}
        onClose={handleCloseModal}
        onSave={handleSave}
        isLoading={createMutation.isPending || updateMutation.isPending}
      >
        <FormInput
          label="Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter phase name"
        />
        <FormInput
          label="Color (Hex)"
          value={formData.color}
          onChangeText={(text) => setFormData({ ...formData, color: text })}
          placeholder="#1976D2"
        />
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
  colorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

