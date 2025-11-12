import mysql from 'mysql2/promise';
import { GetDBSettings } from './dbSettings';

const settings = GetDBSettings();

export async function query<T = unknown>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const connection = await mysql.createConnection(settings);
  const [rows] = await connection.execute(sql, params);
  connection.end();
  return rows as T[];
}
