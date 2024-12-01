import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export default function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (username === 'david' && password === '123') {
      await AsyncStorage.setItem('userToken', 'dummy-token');
      scheduleNotification(); // Jadwalkan notifikasi setelah login berhasil
      navigation.navigate('Home');
    } else {
      Alert.alert('Invalid Credentials', 'Username or password is incorrect');
    }
  };

  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Login Success',
        body: 'Anda berhasil Login',
      },
      trigger: null, // Set trigger to null for immediate display
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Futatabi Yokoso!!</Text>
        <Text style={styles.subText}>Log in now to continue</Text>
      </View>
      <Image 
        source={require('./img/lgn.png')} 
        style={styles.logo} 
      />
      <View style={styles.inputContainer}>
        <View style={[styles.inputWrapper, isUsernameFocused && styles.inputWrapperFocused]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={styles.inputIcon}
          >
            <Image 
              source={require('./img/user.png')} 
              style={styles.icon}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            placeholderTextColor="#aaa"
            onFocus={() => setIsUsernameFocused(true)}
            onBlur={() => setIsUsernameFocused(false)}
          />
        </View>
        <View style={[styles.inputWrapper, isPasswordFocused && styles.inputWrapperFocused]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={styles.inputIcon}
          >
            <Image 
              source={require('./img/pass.png')} 
              style={styles.icon2}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            placeholderTextColor="#aaa"
            secureTextEntry
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={handleLogin} color="orange" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#343a40',
  },
  subText: {
    fontSize: 16,
    color: '#343a40',
    marginTop: 5,
  },
  logo: {
    width: 250,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ced4da',
    marginBottom: 20,
    paddingBottom: 5,
  },
  inputWrapperFocused: {
    borderBottomColor: 'orange',
  },
  inputIcon: {
    marginRight: 10,
  },
  icon: {
    marginLeft: 11,
    width: 20,
    height: 20,
    tintColor: '#aaa',
  },
  icon2: {
    width: 40,
    height: 30,
    tintColor: '#aaa',
  },
  input: {
    flex: 1,
    height: 40,
    color: '#343a40',
    fontSize: 18,
    paddingLeft: 10,
  },
  buttonContainer: {
    marginTop: 20,
    backgroundColor: '#6200EE',
    borderRadius: 5,
    overflow: 'hidden',
  },
});
