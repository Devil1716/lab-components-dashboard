import { ISemesterRepository } from '../interfaces/ISemesterRepository';
import { Semester } from '../../models/types';

export class InMemorySemesterRepository implements ISemesterRepository {
  private semesters: Semester[] = [
    {
      id: 'SEM-1',
      name: 'Fall 2026',
      academic_year: '2026-2027',
      start_date: '2026-08-01',
      end_date: '2026-12-15',
      is_active: true,
      created_at: new Date().toISOString()
    }
  ];

  async findAll(): Promise<Semester[]> { return this.semesters; }
  async findById(id: string): Promise<Semester | null> { return this.semesters.find(s => s.id === id) || null; }
  
  async create(semester: Omit<Semester, 'id' | 'created_at'>): Promise<Semester> {
    const newSem = { ...semester, id: `SEM-${Date.now()}`, created_at: new Date().toISOString() };
    this.semesters.push(newSem);
    return newSem;
  }

  async update(id: string, updateData: Partial<Semester>): Promise<Semester | null> {
    const idx = this.semesters.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.semesters[idx] = { ...this.semesters[idx], ...updateData };
    return this.semesters[idx];
  }

  async delete(id: string): Promise<boolean> {
    const len = this.semesters.length;
    this.semesters = this.semesters.filter(s => s.id !== id);
    return this.semesters.length !== len;
  }
}
