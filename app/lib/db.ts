import mysql from 'mysql2/promise';
import { GetDBSettings } from './dbSettings';

const settings = GetDBSettings();

export async function query(sql: string, params?: unknown[]) {
  const connection = await mysql.createConnection(settings);
  const [results] = await connection.execute(sql, params);
  connection.end();
  return results;
}
