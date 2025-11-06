
import { body, validationResult } from 'express-validator';

// Validaciones para registrar usuario
export const validateUserRegistration = [
    // Validación de Nombre
    body('name')
      .notEmpty()
      .withMessage('El nombre es obligatorio')
      .isLength({ min: 2, max: 50 })
      .withMessage('El nombre debe tener entre 2 y 50 caracteres'),

    // Validación de Email
    body('email')
      .isEmail()
      .withMessage('El email no es válido'),

    // Validación de Contraseña
    body('password')
      .isLength({ min: 8 })
      .withMessage('La contraseña debe tener al menos 8 caracteres')
      .matches(/[A-Z]/)
      .withMessage('La contraseña debe contener al menos una mayúscula')
      .matches(/[0-9]/)
      .withMessage('La contraseña debe contener al menos un número'),

    // Middleware final que chequea errores y devuelve la respuesta
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // 400 Bad Request
        return res.status(400).json({ 
          status: 'fail',
          errors: errors.array({ onlyFirstError: true }) // Solo muestra el primer error por campo
        });
      }
      next();
    },
];

