import { LabBatch } from '../../models/types';

export interface IBatchRepository {
  findAll(): Promise<LabBatch[]>;
  findById(id: string): Promise<LabBatch | null>;
  findByLab(labId: string): Promise<LabBatch[]>;
  create(batch: Omit<LabBatch, 'id'>): Promise<LabBatch>;
  update(id: string, batch: Partial<LabBatch>): Promise<LabBatch | null>;
  delete(id: string): Promise<boolean>;
}
