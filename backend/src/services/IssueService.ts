import { IIssueRepository } from '../repositories/interfaces/IIssueRepository';
import { IComponentRepository } from '../repositories/interfaces/IComponentRepository';
import { IssueTransaction, IssueTransactionItem } from '../models/types';

export class IssueService {
  constructor(
    private issueRepo: IIssueRepository,
    private componentRepo: IComponentRepository
  ) {}

  async issueComponents(transactionData: Omit<IssueTransaction, 'id'>, items: Omit<IssueTransactionItem, 'id' | 'transaction_id'>[]) {
    // 1. Verify component availability
    for (const item of items) {
      const component = await this.componentRepo.findById(item.component_id);
      if (!component || component.available_quantity < item.quantity_issued) {
        throw new Error(`Insufficient stock for component ID: ${item.component_id}`);
      }
    }

    // 2. Create transaction
    const transaction = await this.issueRepo.createTransaction(transactionData, items);

    // 3. Deduct stock
    for (const item of items) {
      const component = await this.componentRepo.findById(item.component_id);
      if (component) {
        await this.componentRepo.update(item.component_id, {
          available_quantity: component.available_quantity - item.quantity_issued
        });
      }
    }

    return transaction;
  }

  async acknowledgeIssue(transactionId: string, studentId: string) {
    await this.issueRepo.updateTransactionStatus(transactionId, {
      issue_status: 'acknowledged',
      acknowledged_by: studentId
    });
  }

  async getBatchTransactions(batchId: string) {
    const transactions = await this.issueRepo.getTransactionsByBatch(batchId);
    
    // Enrich with items
    const enriched = await Promise.all(transactions.map(async tx => {
      const items = await this.issueRepo.getTransactionItems(tx.id!);
      return { ...tx, items };
    }));
    
    return enriched;
  }
}
