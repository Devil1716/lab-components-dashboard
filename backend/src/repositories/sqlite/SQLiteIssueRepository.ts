import { IIssueRepository } from '../interfaces/IIssueRepository';
import { IssueTransaction, IssueTransactionItem } from '../../models/types';
import { getDB } from '../../config/database';
import crypto from 'crypto';

export class SQLiteIssueRepository implements IIssueRepository {
  async createTransaction(transaction: Omit<IssueTransaction, 'id'>, items: Omit<IssueTransactionItem, 'id' | 'transaction_id'>[]): Promise<IssueTransaction> {
    const db = await getDB();
    const txId = `TX-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    
    await db.run('BEGIN TRANSACTION');
    try {
      await db.run(
        'INSERT INTO issue_transactions (id, semester_id, lab_id, session_id, batch_id, issued_by, issued_at, issue_status, return_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [txId, transaction.semester_id, transaction.lab_id, transaction.session_id, transaction.batch_id, transaction.issued_by, new Date().toISOString(), transaction.issue_status, transaction.return_status]
      );

      for (const item of items) {
        const itemId = `TXI-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        await db.run(
          'INSERT INTO issue_transaction_items (id, transaction_id, component_id, quantity_issued, quantity_returned, quantity_damaged, quantity_missing, item_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [itemId, txId, item.component_id, item.quantity_issued, item.quantity_returned, item.quantity_damaged, item.quantity_missing, item.item_status]
        );
      }
      
      await db.run('COMMIT');
      return { ...transaction, id: txId, issued_at: new Date().toISOString() };
    } catch (e) {
      await db.run('ROLLBACK');
      throw e;
    }
  }

  async getTransactionById(id: string): Promise<IssueTransaction | null> {
    const db = await getDB();
    const row = await db.get('SELECT * FROM issue_transactions WHERE id = ?', id);
    return row || null;
  }

  async getTransactionItems(transactionId: string): Promise<IssueTransactionItem[]> {
    const db = await getDB();
    return db.all('SELECT * FROM issue_transaction_items WHERE transaction_id = ?', transactionId);
  }

  async getTransactionsByBatch(batchId: string): Promise<IssueTransaction[]> {
    const db = await getDB();
    return db.all('SELECT * FROM issue_transactions WHERE batch_id = ?', batchId);
  }

  async getAllTransactions(): Promise<IssueTransaction[]> {
    const db = await getDB();
    return db.all('SELECT * FROM issue_transactions');
  }

  async updateTransactionStatus(id: string, status: Partial<IssueTransaction>): Promise<void> {
    const db = await getDB();
    const sets: string[] = [];
    const values: any[] = [];
    for (const [k, v] of Object.entries(status)) {
      if (k === 'id') continue;
      sets.push(`${k} = ?`);
      values.push(v);
    }
    if (sets.length === 0) return;
    values.push(id);
    await db.run(`UPDATE issue_transactions SET ${sets.join(', ')} WHERE id = ?`, values);
  }

  async updateTransactionItemStatus(itemId: string, status: Partial<IssueTransactionItem>): Promise<void> {
    const db = await getDB();
    const sets: string[] = [];
    const values: any[] = [];
    for (const [k, v] of Object.entries(status)) {
      if (k === 'id') continue;
      sets.push(`${k} = ?`);
      values.push(v);
    }
    if (sets.length === 0) return;
    values.push(itemId);
    await db.run(`UPDATE issue_transaction_items SET ${sets.join(', ')} WHERE id = ?`, values);
  }
}
