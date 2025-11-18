import mysql from 'mysql2/promise';
import { GetDBSettings } from './dbSettings';

const settings = GetDBSettings();

const pool = mysql.createPool({
  ...settings,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query<T = unknown>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const [rows] = await pool.execute(sql, params);
  return rows as T[];
}

export async function getConnection() {
  return pool.getConnection();
}
