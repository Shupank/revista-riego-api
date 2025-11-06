import mongoose from 'mongoose';

// 1. Esquema del Subdocumento (Item dentro del pedido)
const itemSchema = new mongoose.Schema({
    producto: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', // Referencia al modelo de Producto
        required: true 
    },
    cantidad: { 
        type: Number, 
        required: true, 
        min: [1, 'La cantidad mínima es 1'] 
    },
    precioUnitario: { 
        type: Number, 
        required: true,
        min: 0 
    }
}, { _id: false }); 

// 2. Esquema Principal (Pedido)
const orderSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Referencia al modelo de Usuario
        required: true 
    },
    items: [itemSchema], // Array de Subdocumentos
    total: { 
        type: Number, 
        required: true,
        min: 0
    },
    status: { 
        type: String, 
        enum: ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'],
        default: 'pendiente' 
    },
}, { timestamps: true });

// Exportación por defecto del modelo Order (CRÍTICO)
export default mongoose.model('Order', orderSchema);