import { Router } from 'express';
import { SemesterController } from '../controllers/SemesterController';

const router = Router();

router.get('/', SemesterController.getAll);
router.get('/:id', SemesterController.getById);
router.post('/', SemesterController.create);
router.put('/:id', SemesterController.update);
router.delete('/:id', SemesterController.delete);

export default router;
