import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { db } from '../config/firebase';

const CounterScreen = () => {
  const [count, setCount] = useState(0);
  const [totemID, setTotemID] = useState('');
  const [ status, setStatus ] = useState<'aguardo'|'finalizado'>('aguardo');




  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const confirmDiscard = async() => {

    const snaptshot = await getDoc(doc(db, 'totens', totemID));
    const dados = snaptshot.data();

    //Atualiza o TOTEM
    updateDoc(doc(db, 'totens', totemID), {
        status: 'finalizando',
        usuario: ''
    })

    setStatus('finalizado')

    //Atualiza o usuário
    const snaptshotUser = await getDoc(doc(db, 'usuarios', dados?.usuario));
    const usuario = snaptshotUser.data();

    updateDoc(doc(db, 'usuarios', dados?.usuario), {
        pontos: usuario.pontos + count
    })

  } 

  useEffect(() => {
    AsyncStorage.getItem('@token_id')
        .then(totemID => setTotemID(totemID || ''));

  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.counterText}>Contador: {count}</Text>
      { status == 'aguardo' && <>
            <View style={styles.buttonContainer}>
            <Button title="-" onPress={decrement} />
            <Button title="+" onPress={increment} />
        </View>
        <Button title="Confirmar Descarte" onPress={confirmDiscard} style={styles.confirmButton} />
        </>
      }

      { status == 'finalizado' && <Text>Espere o Sensor reconhecer o descarte</Text> }

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
  counterText: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
    marginBottom: 20,
  },
  confirmButton: {
    marginTop: 20,
  },
});

export default CounterScreen;
