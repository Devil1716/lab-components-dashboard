import { ISemesterRepository } from '../interfaces/ISemesterRepository';
import { Semester } from '../../models/types';
import { getFirestore } from '../../config/firebase';

export class FirebaseSemesterRepository implements ISemesterRepository {
  private collectionName = 'semesters';

  async findAll(): Promise<Semester[]> {
    const db = getFirestore();
    const snapshot = await db.collection(this.collectionName).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Semester));
  }

  async findById(id: string): Promise<Semester | null> {
    const db = getFirestore();
    const doc = await db.collection(this.collectionName).doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Semester;
  }

  async create(semesterData: Omit<Semester, 'id' | 'created_at'>): Promise<Semester> {
    const db = getFirestore();
    const newSemester = {
      ...semesterData,
      created_at: new Date().toISOString()
    };
    const docRef = await db.collection(this.collectionName).add(newSemester);
    return { id: docRef.id, ...newSemester } as Semester;
  }

  async update(id: string, updateData: Partial<Semester>): Promise<Semester | null> {
    const db = getFirestore();
    const docRef = db.collection(this.collectionName).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;
    await docRef.update(updateData);
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
