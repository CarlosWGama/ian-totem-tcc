import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { router } from 'expo-router';

const SaveIdScreen = () => {
  const [id, setId] = useState('');

  const saveId = async () => {
    try {

        getDoc(doc(db, 'totens', id)).then(async (doc) => {
            if (doc.exists()) {
                await AsyncStorage.setItem('@token_id', id);
                router.replace('/iniciar');
            } else {
                Alert.alert('Error', 'ID não encontrado');
            }
        })
    } catch (error) {
      Alert.alert('Error', 'Failed to save the ID');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter ID"
        value={id}
        onChangeText={setId}
      />
      <Button title="Save ID" onPress={saveId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '80%',
  },
});

export default SaveIdScreen;
