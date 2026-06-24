import { Lab } from '../../models/types';

export interface ILabRepository {
  findAll(): Promise<Lab[]>;
  findById(id: string): Promise<Lab | null>;
  findBySemester(semesterId: string): Promise<Lab[]>;
  create(lab: Omit<Lab, 'id'>): Promise<Lab>;
  update(id: string, lab: Partial<Lab>): Promise<Lab | null>;
  delete(id: string): Promise<boolean>;
}
