import { useEffect, useState } from 'react';

import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  actualizarCategoria,
  agregarCategoria,
  Categoria,
  eliminarCategoria,
  obtenerCategorias,
} from '../categoriasStorage';

export default function CategoriasScreen() {
  const [nombre, setNombre] = useState('');

  const [categorias, setCategorias] =
    useState<Categoria[]>([]);

  const [idEditando, setIdEditando] =
    useState<string | null>(null);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    const datos = await obtenerCategorias();

    setCategorias(datos);
  };

  const guardarCategoria = async () => {
    if (nombre.trim() === '') {
      Alert.alert(
        'Aviso',
        'Escribe el nombre de la categoría'
      );

      return;
    }

    if (idEditando) {
      await actualizarCategoria(
        idEditando,
        nombre
      );

      setIdEditando(null);
    } else {
      await agregarCategoria(nombre);
    }

    setNombre('');

    cargarCategorias();
  };

  const editar = (categoria: Categoria) => {
    setNombre(categoria.nombre);

    setIdEditando(categoria.id);
  };

  const eliminar = async (id: string) => {
    await eliminarCategoria(id);

    cargarCategorias();
  };

  return (
    <View style={styles.contenedor}>

      <Text style={styles.titulo}>
        Control de Gastos
      </Text>

      <Text style={styles.subtitulo}>
        Categorías 
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Ejemplo: Transporte"
        value={nombre}
        onChangeText={setNombre}
      />

      <Button
        title={
          idEditando
            ? 'Actualizar categoría'
            : 'Agregar categoría'
        }
        onPress={guardarCategoria}
      />

      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>

            <Text style={styles.nombreCategoria}>
              {item.nombre}
            </Text>

            <View style={styles.botones}>
              <Button
                title="Editar"
                onPress={() => editar(item)}
              />

              <Button
                title="Eliminar"
                onPress={() => eliminar(item.id)}
              />
            </View>

          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitulo: {
    fontSize: 16,
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },

  tarjeta: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginTop: 15,
  },

  nombreCategoria: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  botones: {
    flexDirection: 'row',
    gap: 10,
  },
});