import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Rutas Públicas (no requieren token)
// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

export default router;