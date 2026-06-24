import { Fine } from '../../models/types';

export interface IFineRepository {
  findAll(): Promise<Fine[]>;
  findByBatch(batchId: string): Promise<Fine[]>;
  create(fine: Omit<Fine, 'id'>): Promise<Fine>;
  updateStatus(id: string, status: Fine['fine_status']): Promise<void>;
}
