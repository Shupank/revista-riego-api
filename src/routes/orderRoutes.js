import express from 'express';
import { 
    getAllOrders, 
    getOrderById, 
    createOrder,
    updateOrder, 
    deleteOrder, 
} from '../controllers/orderController.js';
// Importamos el middleware de autenticación
import verifyToken from '../middleware/verifyToken.js';


const router = express.Router();

// === Rutas de Colección (GET All y POST Create) ===
// Protegidas por verifyToken
router.route('/')
    .get(verifyToken, getAllOrders)  // GET /api/orders (Listar todos)
    .post(verifyToken, createOrder); // POST /api/orders (Crear)

// === Rutas de Documento (GET By ID, PUT Update, DELETE) ===
// Protegidas por verifyToken
router.route('/:id')
    .get(verifyToken, getOrderById)    // GET /api/orders/:id (Leer por ID)
    .put(verifyToken, updateOrder)     // PUT /api/orders/:id (Actualizar)
    .delete(verifyToken, deleteOrder); // DELETE /api/orders/:id (Eliminar)


export default router;