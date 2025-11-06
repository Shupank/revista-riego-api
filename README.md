# Revista Riego API

API RESTful para un e-commerce de productos de riego. Basado en el modelo del TP1.

## Tecnologías
- Node.js
- Express
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- bcrypt (Para hashing de contraseñas)
- dotenv (Gestión de variables de entorno)
- cors
- express-validator (Validación de datos de entrada)

## Cómo Correr la Aplicación

1. **Clonar el Repositorio:**
   ```bash
   git clone [TU_REPO_URL]
   cd revista-riego-api
2. **Instalar dependencias:**

   npm install

3. **Configurar las variables de entorno:**
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>/<dbname>?retryWrites=true&w=majority
JWT_SECRET=tu_secreto_super_seguro
# Opcional: Para CORS si necesitas restringir
# CORS_ORIGINS=http://localhost:5173,[http://otrodominio.com](http://otrodominio.com)

4. **Iniciar el servidor:**

npm run dev

5. **ENDPOINTS de la API:**
Método,Ruta,Descripción,Seguridad
POST,/api/users/register,Registra un nuevo usuario (customer por defecto).,Pública (Validada)
POST,/api/users/login,Autentica al usuario y devuelve un Token JWT.,Pública
GET,/api/users,Lista todos los usuarios.,ADMIN
GET,/api/users/:id,Obtiene un usuario por ID.,Protegida (admin o dueño)
PUT,/api/users/:id,Actualiza datos de un usuario.,Protegida (admin o dueño)
DELETE,/api/users/:id,Elimina un usuario.,ADMIN

6. **Productos:**
Método,Ruta,Descripción,Seguridad
GET,/api/products,Lista todos los productos (poblado con user y category).,Pública
GET,/api/products/:id,Obtiene un producto por ID.,Pública
POST,/api/products,Crea un nuevo producto.,ADMIN
PUT,/api/products/:id,Actualiza un producto.,ADMIN
DELETE,/api/products/:id,Elimina un producto.,ADMIN

6. **Pedidos:**
Método,Ruta,Descripción,Seguridad
GET,/api/orders,Lista todos los pedidos (poblado con user y product).,Protegida
GET,/api/orders/:id,Obtiene un pedido por ID.,Protegida
POST,/api/orders,Crea un nuevo pedido.,Protegida
PUT,/api/orders/:id,Actualiza el estado del pedido.,Protegida
DELETE,/api/orders/:id,Cancela/Elimina un pedido.,Protegida

7. **Ejemplo POST /api/orders Body:**
{
  "user": "60d5ec49f1b2c8b3d4e5f6a2", 
  "items": [
    { "producto": "60d5ec49f1b2c8b3d4e5f6a1", "cantidad": 2 },
    { "producto": "60d5ec49f1b2c8b3d4e5f6b2", "cantidad": 1 }
  ]
}

8. **Notas de Seguridad**
Autenticación JWT: Se requiere el JWT en el header de la solicitud para todas las rutas protegidas: Authorization: Bearer <token>.

Seguridad por Roles: Las rutas de Product y las operaciones sensibles de User están protegidas por el middleware authorizeRole que solo permite el acceso al rol admin.

Validación: Se utiliza express-validator para asegurar la calidad y el formato de los datos de entrada en el registro de usuarios.

Población (populate): Se utiliza populate en Products y Orders para mostrar las relaciones con User y Category/Product.