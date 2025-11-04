import express from 'express';
import { getAllOrders, getOrderById, createOrder } from '../controllers/orderController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', verifyToken, getAllOrders);
router.get('/:id', verifyToken, getOrderById);
router.post('/', verifyToken, createOrder);

export default router;