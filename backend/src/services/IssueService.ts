import { IIssueRepository } from '../repositories/interfaces/IIssueRepository';
import { IComponentRepository } from '../repositories/interfaces/IComponentRepository';
import { IFineRepository } from '../repositories/interfaces/IFineRepository';
import { IssueTransaction, IssueTransactionItem } from '../models/types';

export class IssueService {
  constructor(
    private issueRepo: IIssueRepository,
    private componentRepo: IComponentRepository,
    private fineRepo: IFineRepository
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

  async getAllTransactions() {
    const transactions = await this.issueRepo.getAllTransactions();
    const enriched = await Promise.all(transactions.map(async tx => {
      const items = await this.issueRepo.getTransactionItems(tx.id!);
      return { ...tx, items };
    }));
    return enriched;
  }

  async processReturn(transactionId: string, returnItems: { item_id: string, returned: number, damaged: number, missing: number }[]) {
    const tx = await this.issueRepo.getTransactionById(transactionId);
    if (!tx) throw new Error('Transaction not found');

    for (const returnData of returnItems) {
      const items = await this.issueRepo.getTransactionItems(transactionId);
      const item = items.find(i => i.id === returnData.item_id);
      if (!item) continue;

      const comp = await this.componentRepo.findById(item.component_id);
      if (!comp) continue;

      // Update Item
      await this.issueRepo.updateTransactionItemStatus(item.id!, {
        quantity_returned: returnData.returned,
        quantity_damaged: returnData.damaged,
        quantity_missing: returnData.missing,
        item_status: (returnData.damaged > 0 || returnData.missing > 0) ? 'under_review' : 'returned_properly'
      });

      // Update Component Quantities
      await this.componentRepo.update(item.component_id, {
        available_quantity: comp.available_quantity + returnData.returned,
        damaged_quantity: comp.damaged_quantity + returnData.damaged,
        under_review_quantity: comp.under_review_quantity + returnData.missing
      });

      // Create Fine if damaged/missing
      const penaltyQty = returnData.damaged + returnData.missing;
      if (penaltyQty > 0) {
        await this.fineRepo.create({
          batch_id: tx.batch_id,
          transaction_id: tx.id!,
          component_id: item.component_id,
          quantity: penaltyQty,
          amount: penaltyQty * comp.unit_price,
          reason: `Damaged: ${returnData.damaged}, Missing: ${returnData.missing}`,
          fine_status: 'pending',
          created_at: new Date().toISOString()
        });
      }
    }

    await this.issueRepo.updateTransactionStatus(transactionId, {
      return_status: 'returned'
    });
  }
}
