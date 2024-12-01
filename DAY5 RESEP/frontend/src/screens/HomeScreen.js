// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    navigation.replace('Login');
  };

  const navigateToFavoriteRecipes = () => {
    navigation.navigate('FavoriteRecipes');
  };

  return (
    <ImageBackground source={require('../../img/rspbg.jpg')} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Selamat Datang</Text>
      </View>
     
      <TouchableOpacity 
        style={styles.buttonLogout}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

    
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background
    padding: 20,
    borderRadius: 10,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff', // Text color for visibility
  },
  button: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    backgroundColor: '#1F1A8F', // Button background color
    padding: 10,
    borderRadius: 5,
  },
  buttonLogout: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#ff0000', // Button background color
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff', // Button text color
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HomeScreen;
