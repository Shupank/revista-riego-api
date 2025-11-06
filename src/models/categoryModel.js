import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la categoría es obligatorio'],
        unique: true,
        trim: true,
        maxlength: [50, 'El nombre no puede exceder los 50 caracteres.']
    },
    slug: String, // Para URLs amigables, se puede generar con un hook pre-save
    description: {
        type: String,
        trim: true
    }
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);