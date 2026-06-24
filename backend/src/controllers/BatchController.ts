import { Request, Response } from 'express';
import { BatchService } from '../services/BatchService';
import { InMemoryBatchRepository } from '../repositories/inmemory/InMemoryBatchRepository';

const batchRepo = new InMemoryBatchRepository();
const batchService = new BatchService(batchRepo);

export class BatchController {
  static async getAll(req: Request, res: Response) { res.json(await batchService.getAllBatches()); }
  static async getById(req: Request, res: Response) { res.json(await batchService.getBatchById(req.params.id as string)); }
  static async getByLab(req: Request, res: Response) { res.json(await batchService.getBatchesByLab(req.params.labId as string)); }
  static async create(req: Request, res: Response) { res.status(201).json(await batchService.createBatch(req.body)); }
  static async update(req: Request, res: Response) { res.json(await batchService.updateBatch(req.params.id as string, req.body)); }
  static async delete(req: Request, res: Response) { 
    await batchService.deleteBatch(req.params.id as string); 
    res.status(204).send(); 
  }
}
