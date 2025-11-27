// src/screens/TaskListScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function TaskListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Tarefas (teste)</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('TaskForm')}
      >
        <Text style={styles.buttonText}>Ir para formulário</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
