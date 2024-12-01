import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoriteRecipesScreen = ({ navigation }) => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // State untuk menyimpan resep yang dipilih
  const [modalVisible, setModalVisible] = useState(false); // State untuk mengontrol visibility modal

  useEffect(() => {
    const loadFavorites = async () => {
      const favorites = await AsyncStorage.getItem('favoriteRecipes');
      setFavoriteRecipes(favorites ? JSON.parse(favorites) : []);
    };

    const unsubscribe = navigation.addListener('focus', loadFavorites);
    return unsubscribe;
  }, [navigation]);

  // Fungsi untuk menampilkan modal dengan resep yang dipilih
  const showModal = (recipe) => {
    setSelectedRecipe(recipe);
    setModalVisible(true);
  };

  // Fungsi untuk menutup modal
  const hideModal = () => {
    setSelectedRecipe(null);
    setModalVisible(false);
  };

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeContainer}
      onPress={() => showModal(item)} // Tampilkan modal saat item di-tekan
    >
      <View style={styles.recipeContent}>
        <Text style={styles.name}>{item.nama}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {favoriteRecipes.length > 0 ? (
        <FlatList
          data={favoriteRecipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => item.nama} // Menggunakan item.nama sebagai key
          numColumns={2}
          contentContainerStyle={styles.list}
        />      
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You have no favorite recipes yet.</Text>
        </View>
      )}

      {/* Modal untuk menampilkan detail resep */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={hideModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedRecipe?.nama}</Text>
            <Text style={styles.modalIngredients}>Bahan: {selectedRecipe?.bahan}</Text>
            <Text style={styles.modalInstructions}>Langkah-langkah:</Text>
            {/* Menampilkan langkah-langkah dengan nomor urut */}
            {selectedRecipe?.langkah && selectedRecipe.langkah.split('\n').map((step, index) => (
              <Text key={index} style={styles.modalInstructions}>
                {`${index + 1}. ${step}`}
              </Text>
            ))}
            <Pressable style={styles.modalCloseButton} onPress={hideModal}>
              <Text style={styles.modalCloseText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFBF00',
  },
  list: {
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  recipeContainer: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  recipeContent: {
    padding: 10,
    alignItems: 'center',
  },
  name: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalIngredients: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  modalInstructions: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  modalCloseButton: {
    alignSelf: 'center',
    padding: 10,
    backgroundColor: '#6200EE',
    borderRadius: 5,
    marginTop: 20,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FavoriteRecipesScreen;
