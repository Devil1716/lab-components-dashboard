import { ISemesterRepository } from '../repositories/interfaces/ISemesterRepository';
import { Semester } from '../models/types';

export class SemesterService {
  constructor(private semesterRepo: ISemesterRepository) {}

  async getAllSemesters(): Promise<Semester[]> {
    return await this.semesterRepo.findAll();
  }

  async getSemesterById(id: string): Promise<Semester | null> {
    return await this.semesterRepo.findById(id);
  }

  async createSemester(semesterData: Omit<Semester, 'id' | 'created_at'>): Promise<Semester> {
    return await this.semesterRepo.create(semesterData);
  }

  async updateSemester(id: string, updateData: Partial<Semester>): Promise<Semester | null> {
    return await this.semesterRepo.update(id, updateData);
  }

  async deleteSemester(id: string): Promise<boolean> {
    return await this.semesterRepo.delete(id);
  }
}
