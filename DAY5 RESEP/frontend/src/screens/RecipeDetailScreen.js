import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const RecipeDetailScreen = ({ route }) => {
  const { recipe } = route.params;

  // Memisahkan langkah-langkah menjadi array
  const steps = recipe.langkah.split('\n');

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{recipe.nama}</Text>
        <Text style={styles.subtitle}>Bahan:</Text>
        <Text>{recipe.bahan}</Text>
        <Text style={styles.subtitle}>Langkah-langkah:</Text>
        <FlatList
          data={steps}
          renderItem={({ item, index }) => (
            <View style={styles.stepItem}>
              <Text style={styles.stepNumber}>{index + 1}.</Text>
              <Text style={styles.stepText}>{item}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ marginTop: 10 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFBF00', // Warna background orange
    padding: 20,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    elevation: 2, // Efek bayangan untuk tampilan card
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  stepNumber: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  stepText: {
    flex: 1,
  },
});

export default RecipeDetailScreen;
