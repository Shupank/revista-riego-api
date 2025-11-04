import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('usuario', 'nombre email').populate('items.producto');
    res.status(200).json({ message: 'Pedidos obtenidos', data: orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('usuario').populate('items.producto');
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.status(200).json({ message: 'Pedido obtenido', data: order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    let total = 0;
    const populatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.producto);
      if (!product || product.stock < item.cantidad) {
        return res.status(400).json({ message: `Stock insuficiente para ${product?.nombre}` });
      }
      populatedItems.push({
        producto: product._id,
        cantidad: item.cantidad,
        precioUnitario: product.precio
      });
      total += product.precio * item.cantidad;
      product.stock -= item.cantidad;
      await product.save();
    }

    const order = new Order({
      usuario: req.user.id,
      items: populatedItems,
      total
    });
    await order.save();
    const populatedOrder = await Order.findById(order._id).populate('usuario').populate('items.producto');
    res.status(201).json({ message: 'Pedido creado', data: populatedOrder });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// updateOrder y deleteOrder similares (opcional: solo admin)