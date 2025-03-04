import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('productos.db');

export default function Tab() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    db.execAsync('CREATE TABLE IF NOT EXISTS productos (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, descripcion TEXT);')
      .then(() => cargarProductos())
      .catch(error => console.log('Error creando tabla:', error));
  }, []);

  const guardarProducto = () => {
    if (!nombre || !descripcion) {
      Alert.alert('⚠️ Error', 'Por favor ingresa nombre y descripción.');
      return;
    }

    db.runAsync('INSERT INTO productos (nombre, descripcion) VALUES (?, ?);', [nombre, descripcion])
      .then(() => {
        setNombre('');
        setDescripcion('');
        cargarProductos();
      })
      .catch(error => console.log('Error insertando producto:', error));
  };

  const cargarProductos = () => {
    db.getAllAsync('SELECT * FROM productos;')
      .then(rows => setProductos(rows))
      .catch(error => console.log('Error cargando productos:', error));
  };

  const eliminarProducto = (id) => {
    db.runAsync('DELETE FROM productos WHERE id = ?;', [id])
      .then(() => {
        Alert.alert('Producto Eliminado', 'El producto ha sido eliminado.');
        cargarProductos();
      })
      .catch(error => console.log('Error eliminando producto:', error));
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Ingrese los Productos</Text>

      <TextInput
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, width: '100%', marginBottom: 10 }}
        placeholder="Nombre del producto"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, width: '100%', marginBottom: 10 }}
        placeholder="Descripción del producto"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <Button title="Guardar Producto" onPress={guardarProducto} />

      <Text style={{ fontSize: 16, marginTop: 20, marginBottom: 10 }}>Lista de productos guardados:</Text>

      <FlatList
        data={productos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10, width: '100%' }}>
            <Text style={{ fontSize: 14, marginBottom: 5 }}>Nombre: {item.nombre}</Text>
            <Text style={{ fontSize: 14, marginBottom: 5 }}>Descripción: {item.descripcion}</Text>
            <Button title="Eliminar" onPress={() => eliminarProducto(item.id)} />
          </View>
        )}
      />
    </View>
  );
}