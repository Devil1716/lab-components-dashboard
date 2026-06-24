import { IBatchRepository } from '../repositories/interfaces/IBatchRepository';
import { LabBatch } from '../models/types';

export class BatchService {
  constructor(private batchRepo: IBatchRepository) {}

  async getAllBatches() { return await this.batchRepo.findAll(); }
  async getBatchById(id: string) { return await this.batchRepo.findById(id); }
  async getBatchesByLab(labId: string) { return await this.batchRepo.findByLab(labId); }
  async createBatch(batch: Omit<LabBatch, 'id'>) { return await this.batchRepo.create(batch); }
  async updateBatch(id: string, batch: Partial<LabBatch>) { return await this.batchRepo.update(id, batch); }
  async deleteBatch(id: string) { return await this.batchRepo.delete(id); }
}
