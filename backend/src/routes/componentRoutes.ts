import { Router } from 'express';
import { ComponentController } from '../controllers/ComponentController';

const router = Router();

router.get('/', ComponentController.getAll);
router.get('/:id', ComponentController.getById);
router.post('/', ComponentController.create);
router.put('/:id', ComponentController.update);
router.delete('/:id', ComponentController.delete);

export default router;
