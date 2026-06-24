import { IIssueRepository } from '../interfaces/IIssueRepository';
import { IssueTransaction, IssueTransactionItem } from '../../models/types';
import { getFirestore } from '../../config/firebase';

export class FirebaseIssueRepository implements IIssueRepository {
  async createTransaction(transaction: Omit<IssueTransaction, 'id'>, items: Omit<IssueTransactionItem, 'id' | 'transaction_id'>[]): Promise<IssueTransaction> {
    const db = getFirestore();
    const batch = db.batch();
    
    // Create transaction
    const txRef = db.collection('issue_transactions').doc();
    batch.set(txRef, transaction);
    
    // Create items
    items.forEach(item => {
      const itemRef = db.collection('issue_transaction_items').doc();
      batch.set(itemRef, { ...item, transaction_id: txRef.id });
    });
    
    await batch.commit();
    return { id: txRef.id, ...transaction } as IssueTransaction;
  }

  async getTransactionById(id: string): Promise<IssueTransaction | null> {
    const db = getFirestore();
    const doc = await db.collection('issue_transactions').doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as IssueTransaction;
  }

  async getTransactionItems(transactionId: string): Promise<IssueTransactionItem[]> {
    const db = getFirestore();
    const snapshot = await db.collection('issue_transaction_items').where('transaction_id', '==', transactionId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IssueTransactionItem));
  }

  async getTransactionsByBatch(batchId: string): Promise<IssueTransaction[]> {
    const db = getFirestore();
    const snapshot = await db.collection('issue_transactions').where('batch_id', '==', batchId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IssueTransaction));
  }

  async updateTransactionStatus(id: string, status: Partial<IssueTransaction>): Promise<void> {
    const db = getFirestore();
    await db.collection('issue_transactions').doc(id).update(status);
  }

  async updateTransactionItemStatus(itemId: string, status: Partial<IssueTransactionItem>): Promise<void> {
    const db = getFirestore();
    await db.collection('issue_transaction_items').doc(itemId).update(status);
  }
}
