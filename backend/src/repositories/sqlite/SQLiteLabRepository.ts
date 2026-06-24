import { ILabRepository } from '../interfaces/ILabRepository';
import { Lab } from '../../models/types';
import { getDB } from '../../config/database';
import crypto from 'crypto';

export class SQLiteLabRepository implements ILabRepository {
  async findAll(): Promise<Lab[]> {
    const db = await getDB();
    return db.all('SELECT * FROM labs');
  }

  async findBySemester(semesterId: string): Promise<Lab[]> {
    const db = await getDB();
    return db.all('SELECT * FROM labs WHERE semester_id = ?', semesterId);
  }

  async findById(id: string): Promise<Lab | null> {
    const db = await getDB();
    const row = await db.get('SELECT * FROM labs WHERE id = ?', id);
    return row || null;
  }

  async create(lab: Omit<Lab, 'id'>): Promise<Lab> {
    const db = await getDB();
    const id = `LAB-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    await db.run(
      'INSERT INTO labs (id, semester_id, lab_name, description) VALUES (?, ?, ?, ?)',
      [id, lab.semester_id, lab.lab_name, lab.description]
    );
    return { ...lab, id };
  }

  async update(id: string, updates: Partial<Lab>): Promise<Lab | null> {
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
    await db.run(`UPDATE labs SET ${sets.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const db = await getDB();
    const result = await db.run('DELETE FROM labs WHERE id = ?', id);
    return (result.changes ?? 0) > 0;
  }
}
