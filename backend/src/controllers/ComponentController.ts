import { Request, Response } from 'express';
import { ComponentService } from '../services/ComponentService';
import { SQLiteComponentRepository } from '../repositories/sqlite/SQLiteComponentRepository';

const componentRepo = new SQLiteComponentRepository();
const componentService = new ComponentService(componentRepo);

export class ComponentController {
  static async getAll(req: Request, res: Response) {
    try {
      const components = await componentService.getAllComponents();
      res.json(components);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const component = await componentService.getComponentById(req.params.id as string);
      if (!component) return res.status(404).json({ message: 'Component not found' });
      res.json(component);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const component = await componentService.createComponent(req.body);
      res.status(201).json(component);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const component = await componentService.updateComponent(req.params.id as string, req.body);
      if (!component) return res.status(404).json({ message: 'Component not found' });
      res.json(component);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const success = await componentService.deleteComponent(req.params.id as string);
      if (!success) return res.status(404).json({ message: 'Component not found' });
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
