/**
 * Features Maintenance Screen
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
  useFeatures,
  useCreateFeature,
  useUpdateFeature,
  useDeleteFeature,
  useProducts,
} from '../../../api/hooks';
import type { Feature } from '../../../api/services/features.service';
import { LoadingSpinner, ErrorView, EmptyState, FormModal, FormInput, ListItem } from '../../../components/common';

export function FeaturesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryName: '',
    status: 'planned' as 'planned' | 'in-progress' | 'completed' | 'on-hold',
    createdByName: '',
    technicalDescription: '',
    businessDescription: '',
    productId: '',
  });

  const { data: products = [] } = useProducts();
  const { data: features = [], isLoading, error, refetch } = useFeatures();
  const createMutation = useCreateFeature();
  const updateMutation = useUpdateFeature();
  const deleteMutation = useDeleteFeature();

  const handleOpenModal = (feature?: Feature) => {
    if (feature) {
      setEditingFeature(feature);
      setFormData({
        name: feature.name,
        description: feature.description,
        categoryName: feature.category.name,
        status: feature.status,
        createdByName: feature.createdBy.name,
        technicalDescription: feature.technicalDescription,
        businessDescription: feature.businessDescription,
        productId: feature.productId,
      });
    } else {
      setEditingFeature(null);
      setFormData({
        name: '',
        description: '',
        categoryName: '',
        status: 'planned',
        createdByName: '',
        technicalDescription: '',
        businessDescription: '',
        productId: products[0]?.id || '',
      });
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingFeature(null);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.productId) {
      Alert.alert('Error', 'Name and Product are required');
      return;
    }

    try {
      if (editingFeature) {
        await updateMutation.mutateAsync({
          id: editingFeature.id,
          data: {
            name: formData.name,
            description: formData.description,
            category: { name: formData.categoryName },
            status: formData.status,
            createdBy: { name: formData.createdByName },
            technicalDescription: formData.technicalDescription,
            businessDescription: formData.businessDescription,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          description: formData.description,
          category: { name: formData.categoryName },
          status: formData.status,
          createdBy: { name: formData.createdByName },
          technicalDescription: formData.technicalDescription,
          businessDescription: formData.businessDescription,
          productId: formData.productId,
        });
      }
      handleCloseModal();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save feature');
    }
  };

  const handleDelete = (feature: Feature) => {
    Alert.alert(
      'Delete Feature',
      `Are you sure you want to delete "${feature.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(feature.id);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete feature');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#4caf50';
      case 'in-progress':
        return '#2196f3';
      case 'on-hold':
        return '#ff9800';
      default:
        return '#757575';
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading features..." />;
  }

  if (error) {
    return <ErrorView message={error.message || 'Failed to load features'} onRetry={refetch} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Features</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleOpenModal()}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {features.length === 0 ? (
        <EmptyState
          message="No features found"
          actionLabel="Add Feature"
          onAction={() => handleOpenModal()}
        />
      ) : (
        <FlatList
          data={features}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListItem
              title={item.name}
              subtitle={item.description}
              rightContent={
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
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
        title={editingFeature ? 'Edit Feature' : 'Create Feature'}
        onClose={handleCloseModal}
        onSave={handleSave}
        isLoading={createMutation.isPending || updateMutation.isPending}
      >
        <FormInput
          label="Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter feature name"
        />
        <FormInput
          label="Description"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Enter description"
          multiline
          numberOfLines={3}
        />
        <FormInput
          label="Category"
          value={formData.categoryName}
          onChangeText={(text) => setFormData({ ...formData, categoryName: text })}
          placeholder="Enter category"
        />
        <FormInput
          label="Created By"
          value={formData.createdByName}
          onChangeText={(text) => setFormData({ ...formData, createdByName: text })}
          placeholder="Enter creator name"
        />
        <Text style={styles.note}>
          Note: Full feature editing requires product selection and additional fields.
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  note: {
    fontSize: 12,
    color: '#757575',
    fontStyle: 'italic',
    marginTop: 8,
  },
});

