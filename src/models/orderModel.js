import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  cantidad: { type: Number, required: true, min: 1 },
  precioUnitario: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  estado: { type: String, enum: ['pendiente', 'confirmado', 'enviado', 'entregado'], default: 'pendiente' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);