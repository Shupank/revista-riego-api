import express from 'express';
import { 
    getAllProducts, 
    getProductById, 
    createProduct,
    // Importamos las funciones restantes (Actualizar y Eliminar)
    updateProduct,
    deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

// === Rutas que no requieren ID (GET ALL, POST CREATE) ===
router.route('/')
    .get(getAllProducts)    // GET /api/products
    .post(createProduct);   // POST /api/products

// === Rutas que requieren ID (READ BY ID, UPDATE, DELETE) ===
// Utilizamos router.route() para encadenar los métodos HTTP al mismo endpoint
router.route('/:id')
    .get(getProductById)    // GET /api/products/:id
    .put(updateProduct)     // PUT /api/products/:id (Actualizar)
    .delete(deleteProduct); // DELETE /api/products/:id (Eliminar)


export default router;
