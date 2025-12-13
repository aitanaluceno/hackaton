import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

const LockedScreen = () => {
  return (
    <ThemedView style={styles.container}>
      <Ionicons name="lock-closed" size={60} color="white" />
      <ThemedText type="subtitle" style={styles.text}>
        Completa el formulari abans d'accedir a aquesta secció
      </ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    marginTop: 20,
    textAlign: 'center',
    color: 'white',
  },
});

export default LockedScreen;