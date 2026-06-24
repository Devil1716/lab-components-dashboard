import { ISemesterRepository } from '../interfaces/ISemesterRepository';
import { Semester } from '../../models/types';
import { getDB } from '../../config/database';
import crypto from 'crypto';

export class SQLiteSemesterRepository implements ISemesterRepository {
  async findAll(): Promise<Semester[]> {
    const db = await getDB();
    const rows = await db.all('SELECT * FROM semesters');
    return rows.map(r => ({
      ...r,
      is_active: r.is_active === 1
    }));
  }

  async findById(id: string): Promise<Semester | null> {
    const db = await getDB();
    const row = await db.get('SELECT * FROM semesters WHERE id = ?', id);
    if (!row) return null;
    return { ...row, is_active: row.is_active === 1 };
  }

  async create(semester: Omit<Semester, 'id'>): Promise<Semester> {
    const db = await getDB();
    const id = `SEM-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    await db.run(
      'INSERT INTO semesters (id, name, start_date, end_date, is_active) VALUES (?, ?, ?, ?, ?)',
      [id, semester.name, semester.start_date, semester.end_date, semester.is_active ? 1 : 0]
    );
    return { ...semester, id };
  }

  async update(id: string, updates: Partial<Semester>): Promise<Semester | null> {
    const db = await getDB();
    const sets: string[] = [];
    const values: any[] = [];
    
    for (const [k, v] of Object.entries(updates)) {
      if (k === 'id') continue;
      sets.push(`${k} = ?`);
      values.push(k === 'is_active' ? (v ? 1 : 0) : v);
    }
    
    if (sets.length === 0) return this.findById(id);
    values.push(id);
    await db.run(`UPDATE semesters SET ${sets.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const db = await getDB();
    const result = await db.run('DELETE FROM semesters WHERE id = ?', id);
    return (result.changes ?? 0) > 0;
  }
}
