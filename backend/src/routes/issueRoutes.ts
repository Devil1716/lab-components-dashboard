import { Router } from 'express';
import { IssueController } from '../controllers/IssueController';

const router = Router();

router.get('/', IssueController.getAllTransactions);
router.post('/issue', IssueController.issueComponents);
router.post('/acknowledge', IssueController.acknowledgeIssue);
router.get('/batch/:batchId', IssueController.getBatchTransactions);
router.post('/return', IssueController.processReturn);

export default router;
