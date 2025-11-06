/**
 * Middleware para verificar si el usuario tiene uno de los roles permitidos.
 * * Uso: router.get('/ruta', verifyToken, authorizeRole(['admin', 'customer']), controllerFunction);
 * * @param {string[]} allowedRoles Array de roles permitidos (ej: ['admin', 'customer'])
 * @returns {function} Middleware de Express
 */
const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        // 1. Verificar si hay información de usuario (debe venir de verifyToken)
        if (!req.user || !req.user.role) {
            // Esto no debería suceder si verifyToken se ejecuta antes, pero es una buena práctica de seguridad
            return res.status(403).json({ 
                message: 'Acceso denegado. No se encontró información de rol.' 
            });
        }

        const userRole = req.user.role;

        // 2. Verificar si el rol del usuario está incluido en los roles permitidos
        if (allowedRoles.includes(userRole)) {
            // El rol es permitido, continuar con la siguiente función
            next();
        } else {
            // El rol no es permitido
            return res.status(403).json({ 
                message: `Acceso prohibido. Rol "${userRole}" no autorizado.` 
            });
        }
    };
};

export default authorizeRole;

