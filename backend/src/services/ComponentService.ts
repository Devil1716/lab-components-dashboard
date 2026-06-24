import { IComponentRepository } from '../repositories/interfaces/IComponentRepository';
import { Component } from '../models/types';

export class ComponentService {
  constructor(private componentRepo: IComponentRepository) {}

  async getAllComponents(): Promise<Component[]> {
    return await this.componentRepo.findAll();
  }

  async getComponentById(id: string): Promise<Component | null> {
    return await this.componentRepo.findById(id);
  }

  async createComponent(componentData: Omit<Component, 'id' | 'created_at' | 'updated_at'>): Promise<Component> {
    return await this.componentRepo.create(componentData);
  }

  async updateComponent(id: string, updateData: Partial<Component>): Promise<Component | null> {
    return await this.componentRepo.update(id, updateData);
  }

  async deleteComponent(id: string): Promise<boolean> {
    return await this.componentRepo.delete(id);
  }
}
