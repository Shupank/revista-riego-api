# Revista Riego API

API RESTful para un e-commerce de productos de riego. Basado en el modelo del TP1.

## Tecnologías
- Node.js
- Express
- MongoDB + Mongoose
- JWT
- bcrypt
- dotenv
- cors

## Cómo correr

```bash
git clone https://github.com/Shupank/revista-riego-api.git
cd revista-riego-api
npm install
cp .env.example .env
# Edita .env con tu MONGODB_URI
npm run dev

## Endpoints
Usuarios

POST /api/users/register
POST /api/users/login

Productos

GET /api/products
GET /api/products/:id
POST /api/products → (protegido)
PUT /api/products/:id → (protegido)
DELETE /api/products/:id → (protegido)

Pedidos

GET /api/orders → (protegido)
GET /api/orders/:id → (protegido)
POST /api/orders → (protegido)

Ejemplo POST /api/orders
{
  "items": [
    { "producto": "60d5ec49f1b2c8b3d4e5f6a1", "cantidad": 2 }
  ]
}
Notas

JWT requerido en header: Authorization: Bearer <token>
populate usado en pedidos para mostrar usuario y productos