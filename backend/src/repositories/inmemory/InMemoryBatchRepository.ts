import { IBatchRepository } from '../interfaces/IBatchRepository';
import { LabBatch } from '../../models/types';

export class InMemoryBatchRepository implements IBatchRepository {
  private batches: LabBatch[] = [
    { id: 'BATCH-001', semester_id: 'SEM-1', lab_id: 'LAB-1', batch_name: 'Batch A', max_students: 3, status: 'active' }
  ];

  async findAll(): Promise<LabBatch[]> { return this.batches; }
  async findById(id: string): Promise<LabBatch | null> { return this.batches.find(b => b.id === id) || null; }
  async findByLab(labId: string): Promise<LabBatch[]> { return this.batches.filter(b => b.lab_id === labId); }

  async create(batch: Omit<LabBatch, 'id'>): Promise<LabBatch> {
    const newBatch = { ...batch, id: `BATCH-${Date.now()}` };
    this.batches.push(newBatch);
    return newBatch;
  }

  async update(id: string, updateData: Partial<LabBatch>): Promise<LabBatch | null> {
    const idx = this.batches.findIndex(b => b.id === id);
    if (idx === -1) return null;
    this.batches[idx] = { ...this.batches[idx], ...updateData };
    return this.batches[idx];
  }

  async delete(id: string): Promise<boolean> {
    const len = this.batches.length;
    this.batches = this.batches.filter(b => b.id !== id);
    return this.batches.length !== len;
  }
}
