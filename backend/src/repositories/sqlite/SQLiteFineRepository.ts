import { IFineRepository } from '../interfaces/IFineRepository';
import { Fine } from '../../models/types';
import { getDB } from '../../config/database';
import crypto from 'crypto';

export class SQLiteFineRepository implements IFineRepository {
  async findAll(): Promise<Fine[]> {
    const db = await getDB();
    return db.all('SELECT * FROM fines');
  }

  async findByBatch(batchId: string): Promise<Fine[]> {
    const db = await getDB();
    return db.all('SELECT * FROM fines WHERE batch_id = ?', batchId);
  }

  async create(fine: Omit<Fine, 'id'>): Promise<Fine> {
    const db = await getDB();
    const id = `FINE-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const createdAt = fine.created_at || new Date().toISOString();
    await db.run(
      'INSERT INTO fines (id, batch_id, transaction_id, component_id, quantity, amount, reason, fine_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, fine.batch_id, fine.transaction_id, fine.component_id, fine.quantity, fine.amount, fine.reason, fine.fine_status, createdAt]
    );
    return { ...fine, id, created_at: createdAt };
  }

  async updateStatus(id: string, status: Fine['fine_status']): Promise<void> {
    const db = await getDB();
    await db.run(
      'UPDATE fines SET fine_status = ? WHERE id = ?',
      [status, id]
    );
  }
}
