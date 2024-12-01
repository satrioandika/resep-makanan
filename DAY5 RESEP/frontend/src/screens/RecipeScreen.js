import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Notifications from 'expo-notifications';

const RecipeScreen = () => {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://192.168.0.110:7114/api/Resep/GetAllResep');
        console.log(response.data);
        setRecipes(response.data.data); // Pastikan mengakses data yang benar
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    const loadFavorites = async () => {
      const favorites = await AsyncStorage.getItem('favoriteRecipes');
      setFavoriteRecipes(favorites ? JSON.parse(favorites) : []);
    };

    fetchRecipes();
    loadFavorites();
  }, []);

  const toggleFavorite = async (recipe) => {
    const index = favoriteRecipes.findIndex((item) => item.nama === recipe.nama);
    let newFavorites;

    if (index >= 0) {
      newFavorites = favoriteRecipes.filter((item) => item.nama !== recipe.nama);
      await scheduleNotification('Hapus dari Favorit', `${recipe.nama} Berhasil menghapus dari Favorit`);
    } else {
      newFavorites = [...favoriteRecipes, recipe];
      await scheduleNotification('Tambah ke Favorit', `${recipe.nama} Berhasil ditambahkan ke Favorit`);
    }

    setFavoriteRecipes(newFavorites);
    await AsyncStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites));
  };

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://192.168.0.110:7114/api/Resep/GetAllResep');
      console.log(response.data);
      setRecipes(response.data.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRecipes();
    setRefreshing(false);
  };

  const deleteRecipe = async (recipeName) => {
    try {
      const response = await axios.delete(`http://192.168.0.110:7114/api/Resep/DeleteResep/${recipeName}`);
      if (response.status === 200) {
        // Refresh list setelah berhasil menghapus resep
        await fetchRecipes();
        
        // Hapus juga dari favoriteRecipes
        const newFavorites = favoriteRecipes.filter((item) => item.nama !== recipeName);
        setFavoriteRecipes(newFavorites);
        await AsyncStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites));

        await scheduleNotification('Hapus Resep', `${recipeName} Berhasil dihapus`);
        
        Alert.alert('Success', 'Resep berhasil dihapus');
      } else {
        throw new Error('Failed to delete recipe');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error.message);
      Alert.alert('Error', 'Failed to delete recipe. Please try again.');
    }
  };

  const scheduleNotification = async (title, message) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: message,
      },
      trigger: null, // Set trigger to null for immediate display
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recipeContainer}
            onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
          >
            <View style={styles.recipeTextContainer}>
              <Text style={styles.recipeName}>{item.nama}</Text>
              <Text style={styles.recipeIngredients}>{item.bahan}</Text>
            </View>
            <View style={styles.iconsContainer}>
              <TouchableOpacity onPress={() => toggleFavorite(item)}>
                <Image
                  source={
                    favoriteRecipes.some((favorite) => favorite.nama === item.nama)
                      ? require('../../img/merah.png')
                      : require('../../img/putih.png')
                  }
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteRecipe(item.nama)}>
                <Image
                  source={require('../../img/dlte.png')}
                  style={styles.icon1}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.nama}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#6200EE']}
            tintColor={'#6200EE'}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFBF00',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  list: {
    paddingBottom: 20,
  },
  recipeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
  },
  recipeTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recipeIngredients: {
    fontSize: 14,
    color: '#666',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
  icon1: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
});

export default RecipeScreen;
