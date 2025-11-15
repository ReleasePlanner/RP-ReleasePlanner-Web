/**
 * IT Owners Maintenance Screen
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
  useITOwners,
  useCreateITOwner,
  useUpdateITOwner,
  useDeleteITOwner,
} from '../../../api/hooks';
import type { ITOwner } from '../../../api/services/itOwners.service';
import { LoadingSpinner, ErrorView, EmptyState, FormModal, FormInput, ListItem } from '../../../components/common';

export function ITOwnersScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOwner, setEditingOwner] = useState<ITOwner | null>(null);
  const [name, setName] = useState('');

  const { data: owners = [], isLoading, error, refetch } = useITOwners();
  const createMutation = useCreateITOwner();
  const updateMutation = useUpdateITOwner();
  const deleteMutation = useDeleteITOwner();

  const handleOpenModal = (owner?: ITOwner) => {
    if (owner) {
      setEditingOwner(owner);
      setName(owner.name);
    } else {
      setEditingOwner(null);
      setName('');
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingOwner(null);
    setName('');
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    try {
      if (editingOwner) {
        await updateMutation.mutateAsync({
          id: editingOwner.id,
          data: { name },
        });
      } else {
        await createMutation.mutateAsync({ name });
      }
      handleCloseModal();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save IT Owner');
    }
  };

  const handleDelete = (owner: ITOwner) => {
    Alert.alert(
      'Delete IT Owner',
      `Are you sure you want to delete "${owner.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(owner.id);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete IT Owner');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading IT Owners..." />;
  }

  if (error) {
    return <ErrorView message={error.message || 'Failed to load IT Owners'} onRetry={refetch} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>IT Owners</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleOpenModal()}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {owners.length === 0 ? (
        <EmptyState
          message="No IT Owners found"
          actionLabel="Add IT Owner"
          onAction={() => handleOpenModal()}
        />
      ) : (
        <FlatList
          data={owners}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListItem
              title={item.name}
              onEdit={() => handleOpenModal(item)}
              onDelete={() => handleDelete(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      <FormModal
        visible={modalVisible}
        title={editingOwner ? 'Edit IT Owner' : 'Create IT Owner'}
        onClose={handleCloseModal}
        onSave={handleSave}
        isLoading={createMutation.isPending || updateMutation.isPending}
      >
        <FormInput
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter IT Owner name"
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
});

