import { body, validationResult } from 'express-validator';

// Validaciones para registrar usuario
export const validateUserRegistration = [
  body('email').isEmail().withMessage('El email no es válido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('nombre').notEmpty().withMessage('El nombre es obligatorio'),

  // Middleware final que chequea errores
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
