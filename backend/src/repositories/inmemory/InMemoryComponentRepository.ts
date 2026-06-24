import { IComponentRepository } from '../interfaces/IComponentRepository';
import { Component } from '../../models/types';

export class InMemoryComponentRepository implements IComponentRepository {
  private components: Component[] = [
    {
      id: 'COMP-1',
      component_name: 'Arduino Uno R3',
      category: 'Microcontroller',
      unit_price: 1500,
      total_quantity: 50,
      available_quantity: 50,
      damaged_quantity: 0,
      under_review_quantity: 0,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'COMP-2',
      component_name: '10k Ohm Resistor',
      category: 'Passive',
      unit_price: 5,
      total_quantity: 1000,
      available_quantity: 1000,
      damaged_quantity: 0,
      under_review_quantity: 0,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  async findAll(): Promise<Component[]> {
    return this.components;
  }

  async findById(id: string): Promise<Component | null> {
    return this.components.find(c => c.id === id) || null;
  }

  async create(component: Omit<Component, 'id' | 'created_at' | 'updated_at'>): Promise<Component> {
    const newComp: Component = {
      ...component,
      id: `COMP-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.components.push(newComp);
    return newComp;
  }

  async update(id: string, updateData: Partial<Component>): Promise<Component | null> {
    const index = this.components.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.components[index] = { ...this.components[index], ...updateData, updated_at: new Date().toISOString() };
    return this.components[index];
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.components.length;
    this.components = this.components.filter(c => c.id !== id);
    return this.components.length !== initialLength;
  }
}
