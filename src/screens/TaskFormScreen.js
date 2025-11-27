// src/screens/TaskFormScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TaskFormScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formulário de Tarefas (teste)</Text>
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
  },
});
