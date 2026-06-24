import { Router } from 'express';
import { BatchController } from '../controllers/BatchController';

const router = Router();

router.get('/', BatchController.getAll);
router.get('/:id', BatchController.getById);
router.get('/lab/:labId', BatchController.getByLab);
router.post('/', BatchController.create);
router.put('/:id', BatchController.update);
router.delete('/:id', BatchController.delete);

export default router;
