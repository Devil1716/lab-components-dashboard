import { IComponentRepository } from '../interfaces/IComponentRepository';
import { Component } from '../../models/types';
import { getFirestore } from '../../config/firebase';

export class FirebaseComponentRepository implements IComponentRepository {
  private collectionName = 'components';

  async findAll(): Promise<Component[]> {
    const db = getFirestore();
    const snapshot = await db.collection(this.collectionName).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Component));
  }

  async findById(id: string): Promise<Component | null> {
    const db = getFirestore();
    const doc = await db.collection(this.collectionName).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Component;
  }

  async create(componentData: Omit<Component, 'id' | 'created_at' | 'updated_at'>): Promise<Component> {
    const db = getFirestore();
    const now = new Date().toISOString();
    const newComponent = {
      ...componentData,
      created_at: now,
      updated_at: now
    };
    const docRef = await db.collection(this.collectionName).add(newComponent);
    return { id: docRef.id, ...newComponent } as Component;
  }

  async update(id: string, updateData: Partial<Component>): Promise<Component | null> {
    const db = getFirestore();
    const docRef = db.collection(this.collectionName).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;
    await docRef.update({ ...updateData, updated_at: new Date().toISOString() });
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const db = getFirestore();
    const docRef = db.collection(this.collectionName).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return false;
    await docRef.delete();
    return true;
  }
}
