import express from 'express';
import { register, login } from '../controllers/userController.js'; // <-- named exports

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router; // <-- esto es clave: default export para importarlo en app.js

