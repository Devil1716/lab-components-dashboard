import { apiClient } from './index';

export interface IssueTransaction {
  id?: string;
  semester_id: string;
  lab_id: string;
  session_id: string;
  batch_id: string;
  issued_by: string;
  issued_at?: string;
  issue_status: 'pending_acknowledgment' | 'acknowledged';
  return_status: 'pending' | 'returned' | 'fine_pending' | 'fine_paid';
}

export interface IssueTransactionItem {
  id?: string;
  transaction_id?: string;
  component_id: string;
  quantity_issued: number;
  quantity_returned: number;
  quantity_damaged: number;
  quantity_missing: number;
  item_status: 'issued' | 'returned_proper' | 'returned_damaged' | 'missing';
}

export const IssueAPI = {
  getAll: async () => (await apiClient.get<IssueTransaction[]>('/issues')).data,
  
  getByBatch: async (batchId: string) => (await apiClient.get<IssueTransaction[]>(`/issues/batch/${batchId}`)).data,
  
  // Note: We expect the backend to accept a transaction object and an array of items
  create: async (data: { transaction: Omit<IssueTransaction, 'id'>, items: Omit<IssueTransactionItem, 'id' | 'transaction_id'>[] }) => 
    (await apiClient.post<IssueTransaction>('/issues/issue', data)).data,
    
  acknowledge: async (transactionId: string, studentId: string) =>
    (await apiClient.post('/issues/acknowledge', { transactionId, studentId })).data,

  processReturn: async (transactionId: string, returnItems: { item_id: string, returned: number, damaged: number, missing: number }[]) =>
    (await apiClient.post('/issues/return', { transactionId, returnItems })).data,
};
