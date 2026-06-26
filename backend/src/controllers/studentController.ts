import { Request, Response } from 'express';
import { SQLiteIssueRepository } from '../repositories/sqlite/SQLiteIssueRepository';

const issueRepo = new SQLiteIssueRepository();

export const getStudentData = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    // For now, studentId is just a string stored in issued_by or acknowledged_by
    // We can fetch transactions where they are involved.
    // In our current DB, issued_by is Admin, but we don't have a direct student table link in issue_transactions,
    // wait, we have acknowledged_by which is student ID, or we have batch_id.
    // Actually, we issue to a batch in our current simplified system, or to a specific student?
    // Let's assume the user wants a simple way to query transactions by Batch ID since they are issued to batches.
    const batchId = studentId; 
    
    // In FrontDeskPortal, we were fetching issues by batch.
    const transactions = await issueRepo.getIssuesByBatch(batchId);
    
    res.json({ batchId, transactions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student data', error });
  }
};
