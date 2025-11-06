import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        trim: true,
        maxlength: [100, 'El nombre no puede exceder los 100 caracteres'],
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        default: 0,
    },
    stock: {
        type: Number,
        required: [true, 'El stock es obligatorio'],
        default: 0,
    },
    category: {
        // Asume que tendrás un modelo Category, si no lo tienes, usa String por ahora.
        // Si tienes el modelo Category, esta es la relación de 1 a muchos (Product pertenece a Category)
        type: mongoose.Schema.ObjectId,
        ref: 'Category', 
        required: [true, 'La categoría es obligatoria'],
    },
    user: {
        // Relación OBLIGATORIA: Referencia al usuario que creó o modificó el producto
        // Esto cumple con el requisito de relación entre entidades.
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
}, { 
    timestamps: true,
    toJSON: { virtuals: true }, // Permite que los campos virtuales aparezcan en la salida JSON
    toObject: { virtuals: true }
});

// Definición de un Virtual para enlazar futuras reseñas (Interacciones)
// Cuando consultas un producto, también puedes obtener sus reseñas sin guardarlas
// directamente en el documento del producto.
productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product', // Campo en el modelo Review que referencia a Product
    localField: '_id'        // Campo local (el ID del producto)
});

export default mongoose.model('Product', productSchema);