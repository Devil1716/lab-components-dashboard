import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let dbInstance: Database | null = null;

export const getDB = async (): Promise<Database> => {
  if (dbInstance) return dbInstance;

  dbInstance = await open({
    filename: path.join(__dirname, '../../database.sqlite'),
    driver: sqlite3.Database
  });

  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS semesters (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      is_active INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS labs (
      id TEXT PRIMARY KEY,
      semester_id TEXT NOT NULL,
      lab_name TEXT NOT NULL,
      description TEXT,
      FOREIGN KEY(semester_id) REFERENCES semesters(id)
    );

    CREATE TABLE IF NOT EXISTS batches (
      id TEXT PRIMARY KEY,
      semester_id TEXT NOT NULL,
      lab_id TEXT NOT NULL,
      batch_name TEXT NOT NULL,
      max_students INTEGER NOT NULL,
      status TEXT NOT NULL,
      FOREIGN KEY(lab_id) REFERENCES labs(id),
      FOREIGN KEY(semester_id) REFERENCES semesters(id)
    );

    CREATE TABLE IF NOT EXISTS components (
      id TEXT PRIMARY KEY,
      component_name TEXT NOT NULL,
      category TEXT NOT NULL,
      total_quantity INTEGER NOT NULL,
      available_quantity INTEGER NOT NULL,
      under_review_quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS issue_transactions (
      id TEXT PRIMARY KEY,
      semester_id TEXT NOT NULL,
      lab_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      batch_id TEXT NOT NULL,
      issued_by TEXT NOT NULL,
      issued_at TEXT NOT NULL,
      issue_status TEXT NOT NULL,
      return_status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS issue_transaction_items (
      id TEXT PRIMARY KEY,
      transaction_id TEXT NOT NULL,
      component_id TEXT NOT NULL,
      quantity_issued INTEGER NOT NULL,
      quantity_returned INTEGER NOT NULL,
      quantity_damaged INTEGER NOT NULL,
      quantity_missing INTEGER NOT NULL,
      item_status TEXT NOT NULL,
      FOREIGN KEY(transaction_id) REFERENCES issue_transactions(id),
      FOREIGN KEY(component_id) REFERENCES components(id)
    );

    CREATE TABLE IF NOT EXISTS fines (
      id TEXT PRIMARY KEY,
      batch_id TEXT NOT NULL,
      transaction_id TEXT NOT NULL,
      component_id TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      amount REAL NOT NULL,
      reason TEXT NOT NULL,
      fine_status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(batch_id) REFERENCES batches(id),
      FOREIGN KEY(transaction_id) REFERENCES issue_transactions(id)
    );
  `);

  return dbInstance;
};
