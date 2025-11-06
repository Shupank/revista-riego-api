import express from 'express';
import dotenv from 'dotenv'; 
import cors from 'cors';
import connectDB from './src/config/db.js'; // Conexión a DB

// **********************************************
// PASO CRÍTICO: CARGAR VARIABLES DE ENTORNO ANTES DE USARLAS
dotenv.config(); 
// **********************************************

// Importación de rutas
import userRoutes from './src/routes/userRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import authRoutes from './src/routes/authRoutes.js'; // 1. IMPORTACIÓN DEL ROUTER DE AUTENTICACIÓN

const app = express();

// 1. MIDDLEWARES GLOBALES
app.use(cors());
app.use(express.json()); 

// 2. RUTAS
app.use('/api/auth', authRoutes);    // 2. CONEXIÓN PARA /api/auth (Login, Register)
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// 3. MANEJO DE ERRORES (404 y Global)
app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `No se puede encontrar ${req.originalUrl} en este servidor!`,
    });
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    // Manejo específico del error JWT para dar una respuesta más clara
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({ message: 'Token inválido o expirado' });
        return;
    }
    
    res.status(statusCode).json({
        status: 'error',
        message,
    });
});

// **********************************************
// LÓGICA DE INICIO DEL SERVIDOR 
const PORT = process.env.PORT || 3000;

// 1. Conectar a la base de datos
connectDB();

// 2. Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

export default app;