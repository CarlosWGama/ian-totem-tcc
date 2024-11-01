import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Button, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../../config/firebase';
import { router } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';


export default function TotensLista() {

    const [ totens, setTotens ] = useState<{id: string, nome: string, status: 'parado'|'iniciado'|'aguardo'}[]>();
    // =======================================
    const handleLogout = () => {
            auth.signOut();
            router.replace('/')
    };
    // ========================================
    const getTotens = async () => {
        const snapshot = await getDocs(collection(db, "totens"));
    const totens: {id: string, nome: string, status: 'parado'|'iniciado'|'aguardo'}[] = [];
        snapshot.forEach((doc) => {
            //@ts-ignore
            totens.push({id: doc.id, ...doc.data()});
        });
        setTotens(totens);
    }
    // -----------
    useEffect(() => {
        getTotens();

    }, [])

  return (
    <View style={styles.container}>
      <FlatList
        data={totens}
        renderItem={({ item }: { item: { nome: string; id: string; status: string } }) => (
            <View style={styles.itemContainer}>
              <Text>Totem: {item.nome}</Text>
              <Text>ID: {item.id}</Text>
              <Text>Status: {item.status}</Text>
            </View>
          )}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.buttonContainer}>
        <Button title="Deslogar" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  buttonContainer: {
    marginTop: 20,
  },
});
