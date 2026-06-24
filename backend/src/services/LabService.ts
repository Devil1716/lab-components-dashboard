import { ILabRepository } from '../repositories/interfaces/ILabRepository';
import { Lab } from '../models/types';

export class LabService {
  constructor(private labRepo: ILabRepository) {}

  async getAllLabs() { return await this.labRepo.findAll(); }
  async getLabById(id: string) { return await this.labRepo.findById(id); }
  async getLabsBySemester(semesterId: string) { return await this.labRepo.findBySemester(semesterId); }
  async createLab(lab: Omit<Lab, 'id'>) { return await this.labRepo.create(lab); }
  async updateLab(id: string, lab: Partial<Lab>) { return await this.labRepo.update(id, lab); }
  async deleteLab(id: string) { return await this.labRepo.delete(id); }
}
