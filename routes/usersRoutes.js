import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getUsersAppointments } from '../controllers/userController.js';

const router = express.Router();

router.route('/:user/appointments').get(authMiddleware, getUsersAppointments);

export default router;