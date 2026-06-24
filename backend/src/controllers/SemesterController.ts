import { Request, Response } from 'express';
import { SemesterService } from '../services/SemesterService';
import { InMemorySemesterRepository } from '../repositories/inmemory/InMemorySemesterRepository';

const semesterRepo = new InMemorySemesterRepository();
const semesterService = new SemesterService(semesterRepo);

export class SemesterController {
  static async getAll(req: Request, res: Response) {
    try {
      const semesters = await semesterService.getAllSemesters();
      res.json(semesters);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const semester = await semesterService.getSemesterById(req.params.id as string);
      if (!semester) return res.status(404).json({ message: 'Semester not found' });
      res.json(semester);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const semester = await semesterService.createSemester(req.body);
      res.status(201).json(semester);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const semester = await semesterService.updateSemester(req.params.id as string, req.body);
      if (!semester) return res.status(404).json({ message: 'Semester not found' });
      res.json(semester);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const success = await semesterService.deleteSemester(req.params.id as string);
      if (!success) return res.status(404).json({ message: 'Semester not found' });
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
