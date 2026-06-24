import { Semester } from '../../models/types';

export interface ISemesterRepository {
  findAll(): Promise<Semester[]>;
  findById(id: string): Promise<Semester | null>;
  create(semester: Omit<Semester, 'id' | 'created_at'>): Promise<Semester>;
  update(id: string, semester: Partial<Semester>): Promise<Semester | null>;
  delete(id: string): Promise<boolean>;
}
