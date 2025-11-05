// app.js
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xssClean from 'xss-clean';
import hpp from 'hpp';
import compression from 'compression';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';

// Rutas
import userRoutes from './src/routes/userRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';


// Cargar variables de entorno
dotenv.config();

const app = express();

// Conectar a MongoDB y arrancar servidor solo si se conecta
const PORT = process.env.PORT || 3000;
connectDB()
  .then(() => {
    console.log('✅ MongoDB conectado');

    // Logging solo en desarrollo
    if (process.env.NODE_ENV !== 'production') {
      app.use(morgan('dev'));
    }

    // Middlewares de seguridad
    app.use(helmet());
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));
    app.use(hpp());
    app.use(xssClean());
    app.use(mongoSanitize());
    app.use(compression());

    // Configuración de CORS
    const allowedOrigins = (process.env.CORS_ORIGINS || '')
      .split(',')
      .map(origin => origin.trim())
      .filter(Boolean);

    if (allowedOrigins.length) {
      app.use(cors({ origin: allowedOrigins }));
    } else {
      app.use(cors()); // Permite todos los orígenes si no hay variable
    }

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 min
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
    });
    app.use(limiter);

    // Rutas
    app.use('/api/users', userRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/orders', orderRoutes);


    // Captura rutas no definidas
    app.all('*', (req, res, next) => {
      res.status(404).json({
        status: 'fail',
        message: `Ruta ${req.originalUrl} no encontrada`,
      });
    });

    // Middleware global de errores
    app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(err.statusCode || 500).json({
        status: 'error',
        message: err.message || 'Error interno del servidor',
      });
    });

    // Iniciar servidor
    app.listen(PORT, () =>
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
    );
  })
  .catch(error => {
    console.error('❌ No se pudo conectar a MongoDB:', error);
    process.exit(1); // Termina la app si no hay DB
  });

export default app;
