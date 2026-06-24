import { Request, Response } from 'express';
import { IssueService } from '../services/IssueService';
import { SQLiteIssueRepository } from '../repositories/sqlite/SQLiteIssueRepository';
import { SQLiteComponentRepository } from '../repositories/sqlite/SQLiteComponentRepository';
import { SQLiteFineRepository } from '../repositories/sqlite/SQLiteFineRepository';

const issueRepo = new SQLiteIssueRepository();
const componentRepo = new SQLiteComponentRepository();
const fineRepo = new SQLiteFineRepository();
const issueService = new IssueService(issueRepo, componentRepo, fineRepo);

export class IssueController {
  static async issueComponents(req: Request, res: Response) {
    try {
      const { transaction, items } = req.body;
      const result = await issueService.issueComponents(transaction, items);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async acknowledgeIssue(req: Request, res: Response) {
    try {
      const { transactionId, studentId } = req.body;
      await issueService.acknowledgeIssue(transactionId, studentId);
      res.status(200).json({ message: 'Issue acknowledged successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getBatchTransactions(req: Request, res: Response) {
    try {
      const batchId = req.params.batchId as string;
      const transactions = await issueService.getBatchTransactions(batchId);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async getAllTransactions(req: Request, res: Response) {
    try {
      const transactions = await issueService.getAllTransactions();
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async processReturn(req: Request, res: Response) {
    try {
      const { transactionId, returnItems } = req.body;
      await issueService.processReturn(transactionId, returnItems);
      res.status(200).json({ message: 'Return processed successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
