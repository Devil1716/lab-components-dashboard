import { IBatchRepository } from '../interfaces/IBatchRepository';
import { LabBatch } from '../../models/types';
import { getDB } from '../../config/database';
import crypto from 'crypto';

export class SQLiteBatchRepository implements IBatchRepository {
  async findAll(): Promise<LabBatch[]> {
    const db = await getDB();
    return db.all('SELECT * FROM batches');
  }

  async findByLab(labId: string): Promise<LabBatch[]> {
    const db = await getDB();
    return db.all('SELECT * FROM batches WHERE lab_id = ?', labId);
  }

  async findById(id: string): Promise<LabBatch | null> {
    const db = await getDB();
    const row = await db.get('SELECT * FROM batches WHERE id = ?', id);
    return row || null;
  }

  async create(batch: Omit<LabBatch, 'id'>): Promise<LabBatch> {
    const db = await getDB();
    const id = `BATCH-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    await db.run(
      'INSERT INTO batches (id, semester_id, lab_id, batch_name, max_students, status) VALUES (?, ?, ?, ?, ?, ?)',
      [id, batch.semester_id, batch.lab_id, batch.batch_name, batch.max_students, batch.status]
    );
    return { ...batch, id };
  }

  async update(id: string, updates: Partial<LabBatch>): Promise<LabBatch | null> {
    const db = await getDB();
    const sets: string[] = [];
    const values: any[] = [];
    
    for (const [k, v] of Object.entries(updates)) {
      if (k === 'id') continue;
      sets.push(`${k} = ?`);
      values.push(v);
    }
    
    if (sets.length === 0) return this.findById(id);
    values.push(id);
    await db.run(`UPDATE batches SET ${sets.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const db = await getDB();
    const result = await db.run('DELETE FROM batches WHERE id = ?', id);
    return (result.changes ?? 0) > 0;
  }
}
