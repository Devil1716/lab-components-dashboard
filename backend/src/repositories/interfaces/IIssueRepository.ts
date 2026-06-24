import { IssueTransaction, IssueTransactionItem } from '../../models/types';

export interface IIssueRepository {
  createTransaction(transaction: Omit<IssueTransaction, 'id'>, items: Omit<IssueTransactionItem, 'id' | 'transaction_id'>[]): Promise<IssueTransaction>;
  getTransactionById(id: string): Promise<IssueTransaction | null>;
  getTransactionItems(transactionId: string): Promise<IssueTransactionItem[]>;
  getAllTransactions(): Promise<IssueTransaction[]>;
  getTransactionsByBatch(batchId: string): Promise<IssueTransaction[]>;
  updateTransactionStatus(id: string, status: Partial<IssueTransaction>): Promise<void>;
  updateTransactionItemStatus(itemId: string, status: Partial<IssueTransactionItem>): Promise<void>;
}
