
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import AppNavigator from './src/AppNavigator';  
import HomeScreen from './src/screens/HomeScreen';
import RecipeScreen from './src/screens/RecipeScreen';
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';
import AddRecipeScreen from './src/screens/AddRecipeScreen';
import FavoriteRecipesScreen from './src/screens/FavoriteRecipesScreen';
// import DanIL from './Danil';
// import Argenti from './Argenti';
import LoginScreen from './DetailScreen';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// Inisialisasi navigator
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Navigator untuk halaman Home dengan drawer navigation
function HomeDrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Homes">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Resep" component={RecipeScreen} />
      <Drawer.Screen name="Tambah Resep" component={AddRecipeScreen} />
      <Drawer.Screen name="Favorite Recipes" component={FavoriteRecipesScreen} />
      {/* <Drawer.Screen name="DanIL" component={DanIL} />
      <Drawer.Screen name="Argenti" component={Argenti} /> */}
    </Drawer.Navigator>
  );
} 

// Komponen App utama
export default function App() {
  // return <AppNavigator />;
 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Home" : "Login"}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeDrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );

}
