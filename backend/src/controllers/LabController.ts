import { Request, Response } from 'express';
import { LabService } from '../services/LabService';
import { SQLiteLabRepository } from '../repositories/sqlite/SQLiteLabRepository';

const labRepo = new SQLiteLabRepository();
const labService = new LabService(labRepo);

export class LabController {
  static async getAll(req: Request, res: Response) { res.json(await labService.getAllLabs()); }
  static async getById(req: Request, res: Response) { res.json(await labService.getLabById(req.params.id as string)); }
  static async getBySemester(req: Request, res: Response) { res.json(await labService.getLabsBySemester(req.params.semesterId as string)); }
  static async create(req: Request, res: Response) { res.status(201).json(await labService.createLab(req.body)); }
  static async update(req: Request, res: Response) { res.json(await labService.updateLab(req.params.id as string, req.body)); }
  static async delete(req: Request, res: Response) { 
    await labService.deleteLab(req.params.id as string); 
    res.status(204).send(); 
  }
}
