import express from 'express';
import { getStudentData } from '../controllers/studentController';

const router = express.Router();

router.get('/:studentId', getStudentData);

export default router;
