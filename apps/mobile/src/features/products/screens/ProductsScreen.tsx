/**
 * Products Maintenance Screen
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
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '../../../api/hooks';
import type { Product, ComponentVersion } from '../../../api/services/products.service';
import { LoadingSpinner, ErrorView, EmptyState, FormModal, FormInput, ListItem } from '../../../components/common';

export function ProductsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    components: [] as Array<{ type: 'web' | 'services' | 'mobile'; currentVersion: string; previousVersion: string }>,
  });

  const { data: products = [], isLoading, error, refetch } = useProducts();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        components: product.components.map((c) => ({
          type: c.type,
          currentVersion: c.currentVersion,
          previousVersion: c.previousVersion,
        })),
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        components: [],
      });
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      components: [],
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    try {
      if (editingProduct) {
        await updateMutation.mutateAsync({
          id: editingProduct.id,
          data: {
            name: formData.name,
            components: formData.components.length > 0 ? formData.components : undefined,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          components: formData.components.length > 0 ? formData.components : undefined,
        });
      }
      handleCloseModal();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save product');
    }
  };

  const handleDelete = (product: Product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(product.id);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete product');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  if (error) {
    return <ErrorView message={error.message || 'Failed to load products'} onRetry={refetch} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Products</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleOpenModal()}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {products.length === 0 ? (
        <EmptyState
          message="No products found"
          actionLabel="Add Product"
          onAction={() => handleOpenModal()}
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListItem
              title={item.name}
              subtitle={`${item.components.length} component(s)`}
              onEdit={() => handleOpenModal(item)}
              onDelete={() => handleDelete(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      <FormModal
        visible={modalVisible}
        title={editingProduct ? 'Edit Product' : 'Create Product'}
        onClose={handleCloseModal}
        onSave={handleSave}
        isLoading={createMutation.isPending || updateMutation.isPending}
      >
        <FormInput
          label="Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          placeholder="Enter product name"
        />
        <Text style={styles.note}>
          Note: Components can be managed after creating the product.
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

