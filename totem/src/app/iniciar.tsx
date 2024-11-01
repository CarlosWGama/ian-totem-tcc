import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ToastAndroid, Alert } from 'react-native';
import { db } from '../config/firebase';
import { router } from 'expo-router';

const TelaInicial = () => {

    const [ status, setStatus ] = useState<'parado'|'iniciado'>('parado');
    const [totemID, setTotemID] = useState('');

  const iniciarDescarteHandle = async () => {
    updateDoc(doc(db, 'totens', totemID), {
      status: 'iniciado',
    })
    setStatus('iniciado')

    Alert.alert('Atenção',`Selecione o totem ${totemID} no aplicativo para parear e começar o descarte`)
  };

  const mudarTela = async () => {
    onSnapshot(doc(db, 'totens', totemID), (doc) => {
        const data = doc.data();
        if (data?.status == 'aguardo') 
            router.replace('/descarte');     
    })
  }

  useEffect(() => {
    AsyncStorage.getItem('@token_id')
        .then(totemID => setTotemID(totemID || ''));

    mudarTela();
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Olá mundo</Text>
      { status == 'parado' && <Button title="Iniciar Descarte" onPress={iniciarDescarteHandle} />}
      { status == 'iniciado' && <Text>{`Selecione o totem ${totemID} no aplicativo para parear e começar o descarte`}</Text>}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default TelaInicial;
