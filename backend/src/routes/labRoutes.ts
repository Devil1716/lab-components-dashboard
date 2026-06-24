import { Router } from 'express';
import { LabController } from '../controllers/LabController';

const router = Router();

router.get('/', LabController.getAll);
router.get('/:id', LabController.getById);
router.get('/semester/:semesterId', LabController.getBySemester);
router.post('/', LabController.create);
router.put('/:id', LabController.update);
router.delete('/:id', LabController.delete);

export default router;
