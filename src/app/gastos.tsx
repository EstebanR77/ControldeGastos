import { useCallback, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  Pressable,
} from 'react-native';

import { useFocusEffect } from 'expo-router';

import {
  Gasto,
  obtenerGastos,
  agregarGasto,
  actualizarGasto,
  eliminarGasto,
} from '../gastosDB';

import {
  Categoria,
  obtenerCategorias,
} from '../categoriasStorage';

export default function GastosScreen() {
  const [descripcion, setDescripcion] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');

  const [categorias, setCategorias] =
    useState<Categoria[]>([]);

  const [gastos, setGastos] =
    useState<Gasto[]>([]);

  const [idEditando, setIdEditando] =
    useState<number | null>(null);

  const cargarDatos = async () => {
    const datosGastos = await obtenerGastos();
    const datosCategorias = await obtenerCategorias();

    setGastos(datosGastos);
    setCategorias(datosCategorias);
  };

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [])
  );

  const guardarGasto = async () => {
    if (
      descripcion.trim() === '' ||
      valor.trim() === '' ||
      categoria === ''
    ) {
      Alert.alert(
        'Aviso',
        'Completa todos los campos y selecciona una categoría'
      );

      return;
    }

    const valorNumero = parseFloat(valor);

    if (isNaN(valorNumero)) {
      Alert.alert(
        'Aviso',
        'El valor debe ser numérico'
      );

      return;
    }

    if (idEditando !== null) {
      await actualizarGasto(
        idEditando,
        descripcion,
        valorNumero,
        categoria
      );

      setIdEditando(null);
    } else {
      await agregarGasto(
        descripcion,
        valorNumero,
        categoria
      );
    }

    limpiarFormulario();
    cargarDatos();
  };

  const editar = (gasto: Gasto) => {
    setDescripcion(gasto.descripcion);
    setValor(gasto.valor.toString());
    setCategoria(gasto.categoria);
    setIdEditando(gasto.id);
  };

  const eliminar = async (id: number) => {
    await eliminarGasto(id);
    cargarDatos();
  };

  const limpiarFormulario = () => {
    setDescripcion('');
    setValor('');
    setCategoria('');
    setIdEditando(null);
  };

  return (
    <View style={styles.contenedor}>

      <Text style={styles.titulo}>
        Control de Gastos
      </Text>

      <Text style={styles.subtitulo}>
        Gastos 
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TextInput
        style={styles.input}
        placeholder="Valor"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />

      <Text style={styles.etiqueta}>
        Selecciona una categoría
      </Text>

      {categorias.length === 0 ? (
        <Text style={styles.sinCategorias}>
          Primero crea una categoría en la pestaña Categorías.
        </Text>
      ) : (
        <View style={styles.listaCategorias}>
          {categorias.map((item) => (
            <Pressable
              key={item.id}
              style={[
                styles.categoriaBoton,
                categoria === item.nombre &&
                  styles.categoriaSeleccionada,
              ]}
              onPress={() =>
                setCategoria(item.nombre)
              }
            >
              <Text
                style={[
                  styles.categoriaTexto,
                  categoria === item.nombre &&
                    styles.categoriaTextoSeleccionado,
                ]}
              >
                {item.nombre}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {categoria !== '' && (
        <Text style={styles.seleccion}>
          Categoría seleccionada: {categoria}
        </Text>
      )}

      <Button
        title={
          idEditando !== null
            ? 'Actualizar gasto'
            : 'Registrar gasto'
        }
        onPress={guardarGasto}
      />

      {idEditando !== null && (
        <View style={styles.cancelar}>
          <Button
            title="Cancelar edición"
            onPress={limpiarFormulario}
          />
        </View>
      )}

      <FlatList
        data={gastos}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>

            <Text style={styles.descripcion}>
              {item.descripcion}
            </Text>

            <Text>
              Valor: ${item.valor}
            </Text>

            <Text>
              Categoría: {item.categoria}
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

  etiqueta: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 10,
  },

  listaCategorias: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },

  categoriaBoton: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },

  categoriaSeleccionada: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },

  categoriaTexto: {
    color: '#333',
  },

  categoriaTextoSeleccionado: {
    color: '#fff',
  },

  sinCategorias: {
    marginBottom: 15,
    color: '#666',
  },

  seleccion: {
    marginBottom: 10,
    fontWeight: 'bold',
  },

  tarjeta: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginTop: 15,
  },

  descripcion: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  botones: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },

  cancelar: {
    marginTop: 8,
  },
});