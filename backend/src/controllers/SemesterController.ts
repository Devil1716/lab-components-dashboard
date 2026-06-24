import { Request, Response } from 'express';
import { SemesterService } from '../services/SemesterService';
import { FirebaseSemesterRepository } from '../repositories/firebase/FirebaseSemesterRepository';

// Initialize with Firebase implementation for now
const semesterRepo = new FirebaseSemesterRepository();
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
      const semester = await semesterService.getSemesterById(req.params.id);
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
      const semester = await semesterService.updateSemester(req.params.id, req.body);
      if (!semester) return res.status(404).json({ message: 'Semester not found' });
      res.json(semester);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const success = await semesterService.deleteSemester(req.params.id);
      if (!success) return res.status(404).json({ message: 'Semester not found' });
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
