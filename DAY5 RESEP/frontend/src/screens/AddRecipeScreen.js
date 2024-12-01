import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ImageBackground,
  Platform,
  Alert,
} from "react-native";
import axios from "axios";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

const AddRecipeScreen = () => {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert('Permission not granted to receive notifications');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Expo push token:", token);
    } else {
      Alert.alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };

  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Sukses',
        body: 'Resep berhasil ditambahkan!',
      },
      trigger: null, // Set trigger to null for immediate display
    });
  };

  const fetchRecipes = async () => {
    try {
      const response = await axios.get('http://192.168.0.110:7114/api/Resep/GetAllResep');
      console.log('Latest recipes:', response.data);
      // Lakukan sesuatu dengan data resep yang didapat
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleAddRecipe = async () => {
    try {
      const newRecipe = {
        nama: name,
        bahan: ingredients,
        langkah: instructions,
      };

      const response = await axios.post('http://192.168.0.110:7114/api/Resep/InsertResep', newRecipe);

      if (response.status === 200) {
        setName('');
        setIngredients('');
        setInstructions('');

        await fetchRecipes();

        Alert.alert('Success', 'Resep Berhasil ditambahkan!', [
          { text: 'OK', onPress: () => scheduleNotification() }
        ]);
      } else {
        throw new Error('Gagal menambahkan Resep');
      }
    } catch (error) {
      console.error('Error adding recipe:', error);
      Alert.alert('Error', 'Failed to add recipe. Please try again.');
    }
  };

  return (
    <ImageBackground
      source={require('../../img/bg.jpg')}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nama Resep"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Bahan"
          value={ingredients}
          onChangeText={setIngredients}
        />
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Langkah-langkah"
          value={instructions}
          onChangeText={setInstructions}
          multiline={true}
          numberOfLines={10}
        />
        <Button title="Tambah Resep" onPress={handleAddRecipe} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  multilineInput: {
    height: 120,
    textAlignVertical: 'top',
  },
});

export default AddRecipeScreen;
