import { IComponentRepository } from '../interfaces/IComponentRepository';
import { Component } from '../../models/types';
import { getDB } from '../../config/database';
import crypto from 'crypto';

export class SQLiteComponentRepository implements IComponentRepository {
  async findAll(): Promise<Component[]> {
    const db = await getDB();
    return db.all('SELECT * FROM components');
  }

  async findById(id: string): Promise<Component | null> {
    const db = await getDB();
    const row = await db.get('SELECT * FROM components WHERE id = ?', id);
    return row || null;
  }

  async create(component: Omit<Component, 'id'>): Promise<Component> {
    const db = await getDB();
    const id = `COMP-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    await db.run(
      'INSERT INTO components (id, component_name, category, total_quantity, available_quantity, under_review_quantity, unit_price, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, component.component_name, component.category, component.total_quantity, component.available_quantity, component.under_review_quantity, component.unit_price, component.status]
    );
    return { ...component, id };
  }

  async update(id: string, updates: Partial<Component>): Promise<Component | null> {
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
    await db.run(`UPDATE components SET ${sets.join(', ')} WHERE id = ?`, values);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const db = await getDB();
    const result = await db.run('DELETE FROM components WHERE id = ?', id);
    return (result.changes ?? 0) > 0;
  }
}
