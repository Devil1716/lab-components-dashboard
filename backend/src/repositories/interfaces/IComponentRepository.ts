import { Component } from '../../models/types';

export interface IComponentRepository {
  findAll(): Promise<Component[]>;
  findById(id: string): Promise<Component | null>;
  create(component: Omit<Component, 'id' | 'created_at' | 'updated_at'>): Promise<Component>;
  update(id: string, component: Partial<Component>): Promise<Component | null>;
  delete(id: string): Promise<boolean>;
}
