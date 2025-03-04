import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function Tab() {
  const [inputData, setInputData] = useState(''); // Estado para el dato ingresado
  const [storedData, setStoredData] = useState(''); // Estado para el dato almacenado

  // Guardar datos en SecureStore
  const saveData = async () => {
    try {
      await SecureStore.setItemAsync('userData', inputData); // Guarda el dato
      Alert.alert('Guardado', 'Dato guardado correctamente.');
      setInputData(''); // Limpia el campo de entrada
      loadData(); // Recarga el dato almacenado
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el dato.');
    }
  };

  // Cargar datos desde SecureStore
  const loadData = async () => {
    try {
      const value = await SecureStore.getItemAsync('userData'); // Obtiene el dato
      if (value !== null) {
        setStoredData(value); // Actualiza el estado con el dato cargado
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar el dato.');
    }
  };

  // Eliminar datos de SecureStore
  const clearData = async () => {
    try {
      await SecureStore.deleteItemAsync('userData'); // Elimina el dato
      setStoredData(''); // Limpia el estado del dato almacenado
      Alert.alert('Eliminado', 'Elemento eliminado.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el dato.');
    }
  };

  // Cargar el dato almacenado al iniciar la aplicación
  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{fontSize: 20, marginBottom: 5,}}>Ingresa un dato:</Text>

      <TextInput
        style={{borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, width: '100%', marginBottom: 20,}}
        placeholder="Ingresa un dato"
        value={inputData}
        onChangeText={setInputData}
      />

        <Button title="Guardar Dato" onPress={saveData} style={{ marginVertical: 5 }}/>
        <Button title="Cargar Dato" onPress={loadData} />
        <Button title="Eliminar Dato" onPress={clearData} />

      {storedData ? <Text style={{marginTop: 20, fontSize: 16,}}>Dato guardado: {storedData}</Text> : 
      <Text style={{marginTop: 20, fontSize: 16,}}>Dato guardado:</Text>}
    </View>
  );
}
