import 'dotenv/config';
import { DataSource } from 'typeorm';
import { InitialSchema1700000000000 } from './migrations/1700000000000-InitialSchema';

export const dataSourceOptions = {
  type: 'mysql' as const,
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'omnaad',
  charset: 'utf8mb4',
  timezone: 'Z',
  synchronize: false,
  migrations: [InitialSchema1700000000000],
  migrationsTableName: 'node_migrations',
};

export default new DataSource(dataSourceOptions);
