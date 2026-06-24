import { Router } from 'express';
import { IssueController } from '../controllers/IssueController';

const router = Router();

router.post('/issue', IssueController.issueComponents);
router.post('/acknowledge', IssueController.acknowledgeIssue);
router.get('/batch/:batchId', IssueController.getBatchTransactions);

export default router;
