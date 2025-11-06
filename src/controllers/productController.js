import Product from '../models/productModel.js';
// Importamos el modelo de Categoría para el controlador de categorías (si se necesita)
import Category from '../models/categoryModel.js';

// Función de utilidad para manejar la carga de relaciones
const populateOptions = [
    { path: 'user', select: 'name email role' }, // Carga el usuario que creó el producto, excluyendo el password
    { path: 'category', select: 'name' },        // Carga el nombre de la categoría
    { path: 'reviews' }                          // Carga las reseñas (virtual), asumiendo que el modelo Review existe
];

// --- R (Read) - Leer todos los productos con relaciones ---
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
        .populate(populateOptions); // <--- Implementación de .populate()

    res.status(200).json({ 
        status: 'success',
        results: products.length,
        data: products 
    });
  } catch (error) {
    // 500 Internal Server Error
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error interno del servidor al buscar productos' });
  }
};

// --- R (Read) - Leer producto por ID con relaciones ---
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
        .populate(populateOptions); // <--- Implementación de .populate()

    if (!product) {
        // 404 Not Found
        return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    res.status(200).json({ 
        status: 'success',
        data: product 
    });
  } catch (error) {
    // 400 Bad Request: Generalmente un ID malformado
    res.status(400).json({ message: 'ID de producto inválido' });
  }
};

// --- C (Create) - Crear nuevo producto ---
export const createProduct = async (req, res) => {
  try {
    // El ID del usuario creador se podría obtener de la sesión/token JWT (si se implementa authMiddleware)
    // Asumiendo que req.body ya incluye 'user' y 'category' IDs válidos por ahora.
    const product = new Product(req.body);
    await product.save();

    // Opcional: Popular el producto recién creado para devolver la información completa
    await product.populate(populateOptions); 

    // 201 Created
    res.status(201).json({ 
        status: 'success',
        message: 'Producto creado', 
        data: product 
    });
  } catch (error) {
    // 400 Bad Request: Error de validación de Mongoose
    res.status(400).json({ message: error.message });
  }
};

// --- U (Update) - Actualizar producto ---
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { 
        new: true, 
        runValidators: true // Aplicar validaciones de Mongoose en el update
    })
        .populate(populateOptions); // <--- Implementación de .populate()

    if (!product) {
        // 404 Not Found
        return res.status(404).json({ message: 'Producto no encontrado para actualizar' });
    }

    // 200 OK
    res.status(200).json({ 
        status: 'success',
        message: 'Producto actualizado', 
        data: product 
    });
  } catch (error) {
    // 400 Bad Request: Error de validación o ID malformado
    res.status(400).json({ message: error.message });
  }
};

// --- D (Delete) - Eliminar producto ---
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        // 404 Not Found
        return res.status(404).json({ message: 'Producto no encontrado para eliminar' });
    }

    // 204 No Content (Éxito sin cuerpo de respuesta)
    res.status(204).json({ 
        status: 'success', 
        data: null 
    });
  } catch (error) {
    // 500 Internal Server Error
    res.status(500).json({ message: 'Error interno del servidor al eliminar producto' });
  }
};