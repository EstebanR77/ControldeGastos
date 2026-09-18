import * as SQLite from 'expo-sqlite';

export type Gasto = {
  id: number;
  descripcion: string;
  valor: number;
  categoria: string;
};

let db: SQLite.SQLiteDatabase | null = null;

export const iniciarBD = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('gastos.db');

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS gastos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        descripcion TEXT NOT NULL,
        valor REAL NOT NULL,
        categoria TEXT NOT NULL
      );
    `);
  }

  return db;
};

export const obtenerGastos = async (): Promise<Gasto[]> => {
  const database = await iniciarBD();

  return await database.getAllAsync<Gasto>(
    'SELECT * FROM gastos ORDER BY id DESC'
  );
};

export const agregarGasto = async (
  descripcion: string,
  valor: number,
  categoria: string
) => {
  const database = await iniciarBD();

  await database.runAsync(
    `INSERT INTO gastos
    (descripcion, valor, categoria)
    VALUES (?, ?, ?)`,
    descripcion,
    valor,
    categoria
  );
};

export const actualizarGasto = async (
  id: number,
  descripcion: string,
  valor: number,
  categoria: string
) => {
  const database = await iniciarBD();

  await database.runAsync(
    `UPDATE gastos
     SET descripcion = ?,
         valor = ?,
         categoria = ?
     WHERE id = ?`,
    descripcion,
    valor,
    categoria,
    id
  );
};

export const eliminarGasto = async (id: number) => {
  const database = await iniciarBD();

  await database.runAsync(
    'DELETE FROM gastos WHERE id = ?',
    id
  );
};