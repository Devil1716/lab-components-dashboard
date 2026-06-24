import { IIssueRepository } from '../interfaces/IIssueRepository';
import { IssueTransaction, IssueTransactionItem } from '../../models/types';

export class InMemoryIssueRepository implements IIssueRepository {
  private transactions: IssueTransaction[] = [
    {
      id: 'TX-1001',
      semester_id: 'SEM-1',
      lab_id: 'LAB-1',
      session_id: 'SESS-1',
      batch_id: 'BATCH-001',
      issued_by: 'Admin',
      issued_at: new Date().toISOString(),
      issue_status: 'pending_acknowledgment',
      return_status: 'pending'
    }
  ];

  private items: IssueTransactionItem[] = [
    {
      id: 'ITEM-1',
      transaction_id: 'TX-1001',
      component_id: 'COMP-1',
      quantity_issued: 2,
      quantity_returned: 0,
      quantity_damaged: 0,
      quantity_missing: 0,
      item_status: 'issued'
    }
  ];

  async createTransaction(transaction: Omit<IssueTransaction, 'id'>, items: Omit<IssueTransactionItem, 'id' | 'transaction_id'>[]): Promise<IssueTransaction> {
    const newTx: IssueTransaction = { ...transaction, id: `TX-${Date.now()}` };
    this.transactions.push(newTx);
    
    items.forEach((item, index) => {
      this.items.push({ ...item, id: `ITEM-${Date.now()}-${index}`, transaction_id: newTx.id! });
    });
    
    return newTx;
  }

  async getTransactionById(id: string): Promise<IssueTransaction | null> {
    return this.transactions.find(t => t.id === id) || null;
  }

  async getTransactionItems(transactionId: string): Promise<IssueTransactionItem[]> {
    return this.items.filter(i => i.transaction_id === transactionId);
  }

  async getTransactionsByBatch(batchId: string): Promise<IssueTransaction[]> {
    return this.transactions.filter(t => t.batch_id === batchId);
  }

  async getAllTransactions(): Promise<IssueTransaction[]> {
    return this.transactions;
  }

  async updateTransactionStatus(id: string, status: Partial<IssueTransaction>): Promise<void> {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transactions[index] = { ...this.transactions[index], ...status };
    }
  }

  async updateTransactionItemStatus(itemId: string, status: Partial<IssueTransactionItem>): Promise<void> {
    const index = this.items.findIndex(i => i.id === itemId);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...status };
    }
  }
}
