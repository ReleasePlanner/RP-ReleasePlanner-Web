/**
 * Release Plans Screen
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
  usePlans,
  useCreatePlan,
  useUpdatePlan,
  useDeletePlan,
} from '../../../api/hooks';
import type { Plan } from '../../../api/services/plans.service';
import { LoadingSpinner, ErrorView, EmptyState, FormModal, FormInput, ListItem } from '../../../components/common';

export function PlansScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    startDate: '',
    endDate: '',
    status: 'planned' as 'planned' | 'in_progress' | 'done' | 'paused',
    description: '',
  });

  const { data: plans = [], isLoading, error, refetch } = usePlans();
  const createMutation = useCreatePlan();
  const updateMutation = useUpdatePlan();
  const deleteMutation = useDeletePlan();

  const handleOpenModal = (plan?: Plan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        owner: plan.owner,
        startDate: plan.startDate,
        endDate: plan.endDate,
        status: plan.status,
        description: plan.description || '',
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        owner: '',
        startDate: '',
        endDate: '',
        status: 'planned',
        description: '',
      });
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingPlan(null);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.owner.trim() || !formData.startDate || !formData.endDate) {
      Alert.alert('Error', 'Name, Owner, Start Date, and End Date are required');
      return;
    }

    try {
      if (editingPlan) {
        await updateMutation.mutateAsync({
          id: editingPlan.id,
          data: {
            name: formData.name,
            owner: formData.owner,
            startDate: formData.startDate,
            endDate: formData.endDate,
            status: formData.status,
            description: formData.description || undefined,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          owner: formData.owner,
          startDate: formData.startDate,
          endDate: formData.endDate,
          status: formData.status,
          description: formData.description || undefined,
        });
      }
      handleCloseModal();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save plan');
    }
  };

  const handleDelete = (plan: Plan) => {
    Alert.alert(
      'Delete Plan',
      `Are you sure you want to delete "${plan.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(plan.id);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete plan');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return '#4caf50';
      case 'in_progress':
        return '#2196f3';
      case 'paused':
        return '#ff9800';
      default:
        return '#757575';
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading plans..." />;
  }

  if (error) {
    return <ErrorView message={error.message || 'Failed to load plans'} onRetry={refetch} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Release Plans</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleOpenModal()}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {plans.length === 0 ? (
        <EmptyState
          message="No plans found"
          actionLabel="Add Plan"
          onAction={() => handleOpenModal()}
        />
      ) : (
        <FlatList
          data={plans}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListItem
              title={item.name}
              subtitle={`Owner: ${item.owner} | ${item.startDate} - ${item.endDate}`}
              rightContent={
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{item.status.replace('_', ' ')}</Text>
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
        title={editingPlan ? 'Edit Plan' : 'Create Plan'}
        onClose={handleCloseModal}
        onSave={handleSave}
        isLoading={createMutation.isPending || updateMutation.isPending}
      >
        <FormInput
          label="Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter plan name"
        />
        <FormInput
          label="Owner"
          value={formData.owner}
          onChangeText={(text) => setFormData({ ...formData, owner: text })}
          placeholder="Enter owner name"
        />
        <FormInput
          label="Start Date (YYYY-MM-DD)"
          value={formData.startDate}
          onChangeText={(text) => setFormData({ ...formData, startDate: text })}
          placeholder="2024-01-01"
        />
        <FormInput
          label="End Date (YYYY-MM-DD)"
          value={formData.endDate}
          onChangeText={(text) => setFormData({ ...formData, endDate: text })}
          placeholder="2024-12-31"
        />
        <FormInput
          label="Description (Optional)"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          placeholder="Enter description"
          multiline
          numberOfLines={3}
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
});

