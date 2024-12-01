import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './screens/HomeScreen';
import RecipeScreen from './screens/RecipeScreen';
import AddRecipeScreen from './screens/AddRecipeScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';
import FavoriteRecipesScreen from './screens/FavoriteRecipesScreen';
import LoginResep from '../DetailScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function RecipeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Recipes" component={RecipeScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!token);
      setLoading(false);
    };
    checkLoginStatus();
  }, []);

  if (loading) {
    return null; // Atau bisa menggantinya dengan sebuah splash screen atau loading indicator
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Recipes" component={RecipeStack} />
          <Drawer.Screen name="Add Recipe" component={AddRecipeScreen} />
          <Drawer.Screen name="Resep Favorit" component={FavoriteRecipesScreen} />
        </Drawer.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={LoginResep}
            options={{ headerShown: false }} // Menghilangkan header pada halaman login
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default AppNavigator;
