import { Request, Response } from 'express';
import { IssueService } from '../services/IssueService';
import { FirebaseIssueRepository } from '../repositories/firebase/FirebaseIssueRepository';
import { FirebaseComponentRepository } from '../repositories/firebase/FirebaseComponentRepository';

const issueRepo = new FirebaseIssueRepository();
const componentRepo = new FirebaseComponentRepository();
const issueService = new IssueService(issueRepo, componentRepo);

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
      const { batchId } = req.params;
      const transactions = await issueService.getBatchTransactions(batchId);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
