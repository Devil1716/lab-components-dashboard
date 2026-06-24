import { ILabRepository } from '../interfaces/ILabRepository';
import { Lab } from '../../models/types';

export class InMemoryLabRepository implements ILabRepository {
  private labs: Lab[] = [
    { id: 'LAB-1', lab_name: 'Electronics Lab', semester_id: 'SEM-1' }
  ];

  async findAll(): Promise<Lab[]> { return this.labs; }
  async findById(id: string): Promise<Lab | null> { return this.labs.find(l => l.id === id) || null; }
  async findBySemester(semesterId: string): Promise<Lab[]> { return this.labs.filter(l => l.semester_id === semesterId); }
  
  async create(lab: Omit<Lab, 'id'>): Promise<Lab> {
    const newLab = { ...lab, id: `LAB-${Date.now()}` };
    this.labs.push(newLab);
    return newLab;
  }
  
  async update(id: string, updateData: Partial<Lab>): Promise<Lab | null> {
    const idx = this.labs.findIndex(l => l.id === id);
    if (idx === -1) return null;
    this.labs[idx] = { ...this.labs[idx], ...updateData };
    return this.labs[idx];
  }

  async delete(id: string): Promise<boolean> {
    const len = this.labs.length;
    this.labs = this.labs.filter(l => l.id !== id);
    return this.labs.length !== len;
  }
}
