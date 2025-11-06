
import express from 'express';
import { 
    register, 
    login,
    getAllUsers, 
    getUserById, 
    updateUser,  
    deleteUser   
} from '../controllers/userController.js'; 

const router = express.Router();

// === Rutas de Autenticación ===
router.post('/register', register); 
router.post('/login', login);       

// === Rutas CRUD restantes ===

// GET /api/users
router.get('/', getAllUsers); 

router.route('/:id')
    .get(getUserById)
    .put(updateUser) 
    .delete(deleteUser);


export default router;
