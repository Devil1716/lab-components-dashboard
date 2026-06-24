import { IFineRepository } from '../interfaces/IFineRepository';
import { Fine } from '../../models/types';

export class InMemoryFineRepository implements IFineRepository {
  private fines: Fine[] = [];

  async findAll(): Promise<Fine[]> { return this.fines; }
  async findByBatch(batchId: string): Promise<Fine[]> { return this.fines.filter(f => f.batch_id === batchId); }
  
  async create(fine: Omit<Fine, 'id'>): Promise<Fine> {
    const newFine = { ...fine, id: `FINE-${Date.now()}` };
    this.fines.push(newFine);
    return newFine;
  }
  
  async updateStatus(id: string, status: Fine['fine_status']): Promise<void> {
    const idx = this.fines.findIndex(f => f.id === id);
    if (idx !== -1) this.fines[idx].fine_status = status;
  }
}
