import AsyncStorage from '@react-native-async-storage/async-storage';

export type Categoria = {
  id: string;
  nombre: string;
};

const CLAVE_CATEGORIAS = 'categorias';

export const obtenerCategorias = async (): Promise<Categoria[]> => {
  const datos = await AsyncStorage.getItem(CLAVE_CATEGORIAS);

  if (datos) {
    return JSON.parse(datos);
  }

  return [];
};

export const agregarCategoria = async (nombre: string) => {
  const categorias = await obtenerCategorias();

  const nuevaCategoria: Categoria = {
    id: Date.now().toString(),
    nombre: nombre,
  };

  const nuevasCategorias = [
    ...categorias,
    nuevaCategoria,
  ];

  await AsyncStorage.setItem(
    CLAVE_CATEGORIAS,
    JSON.stringify(nuevasCategorias)
  );
};

export const actualizarCategoria = async (
  id: string,
  nuevoNombre: string
) => {
  const categorias = await obtenerCategorias();

  const categoriasActualizadas = categorias.map((categoria) => {
    if (categoria.id === id) {
      return {
        ...categoria,
        nombre: nuevoNombre,
      };
    }

    return categoria;
  });

  await AsyncStorage.setItem(
    CLAVE_CATEGORIAS,
    JSON.stringify(categoriasActualizadas)
  );
};

export const eliminarCategoria = async (id: string) => {
  const categorias = await obtenerCategorias();

  const categoriasFiltradas = categorias.filter(
    (categoria) => categoria.id !== id
  );

  await AsyncStorage.setItem(
    CLAVE_CATEGORIAS,
    JSON.stringify(categoriasFiltradas)
  );
};