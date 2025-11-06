import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Función auxiliar para generar el token JWT
const generateToken = (id, role) => {
    // CRÍTICO: Asegúrate de que JWT_SECRET esté entre comillas dobles en el .env
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '7d', // El token expira en 7 días
    });
};

// =========================================================
// 1. INICIO DE SESIÓN (POST /api/auth/login)
// =========================================================
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Buscar el usuario por email. Utilizamos select('+password') para forzar la inclusión de la contraseña
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ 
                message: 'Credenciales inválidas (Usuario no encontrado)' 
            });
        }

        // 2. Verificar la contraseña
        // Compara el hash guardado (user.password) con la contraseña plana recibida (password)
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ 
                message: 'Credenciales inválidas (Contraseña incorrecta)' 
            });
        }

        // 3. Generar el Token JWT
        const token = generateToken(user._id, user.role);

        // 4. Respuesta exitosa
        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// =========================================================
// 2. REGISTRO (POST /api/auth/register)
// =========================================================
export const register = async (req, res) => {
    // Nota: El hash de la contraseña debe realizarse en el hook pre-save del userModel.js
    const { name, email, password, role } = req.body;

    try {
        // Verificar si el usuario ya existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'El usuario con este email ya existe.' });
        }

        // Crear nuevo usuario (el hash se hace automáticamente si usas el pre-save hook)
        user = await User.create({ 
            name, 
            email, 
            password, 
            role: role || 'customer' 
        });

        // Generar Token JWT
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            status: 'success',
            message: 'Usuario registrado exitosamente.',
            token,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            }
        });

    } catch (error) {
        // Manejo específico para errores de validación (ej: falta el nombre)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error('Error en el registro:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};