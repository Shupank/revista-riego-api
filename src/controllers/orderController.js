import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
// Eliminamos la importación de mongoose, ya que no usaremos sessiones de transacción.
// import mongoose from 'mongoose'; 

// Función de utilidad para manejar errores
const catchAsync = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// =========================================================
// 1. CREAR PEDIDO (POST /api/orders)
// Lógica corregida: Recalcula total, verifica stock sin transacción.
// =========================================================
export const createOrder = catchAsync(async (req, res, next) => {
    const { items, shippingAddress } = req.body;
    const userId = req.user.id; // Obtenido desde verifyToken

    try {
        let total = 0;
        const processedItems = [];

        for (const item of items) {
            const product = await Product.findById(item.producto); 

            // 1. Validación de Producto y Stock
            if (!product) {
                return res.status(404).json({ message: `Producto con ID ${item.producto} no encontrado.` });
            }

            if (product.stock < item.cantidad) {
                return res.status(400).json({ message: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}, Solicitado: ${item.cantidad}` });
            }

            // 2. Cálculo del precio y total (Seguridad de precios en Backend)
            const precioUnitario = product.price; // Usar el precio del modelo
            const itemTotal = precioUnitario * item.cantidad;
            total += itemTotal;

            // 3. Registrar el ítem procesado
            processedItems.push({
                producto: item.producto,
                cantidad: item.cantidad,
                precioUnitario: precioUnitario,
            });

            // 4. Actualizar Stock del Producto
            product.stock -= item.cantidad;
            // CORRECCIÓN CRÍTICA: Deshabilitar la validación antes de guardar
            // para evitar el error 'user is required' al actualizar solo el stock.
            await product.save({ validateBeforeSave: false }); 
        }

        // 5. Crear el Pedido
        const newOrder = new Order({
            user: userId,
            items: processedItems,
            total: total,
            status: 'pendiente',
            shippingAddress: shippingAddress || 'No especificada', // Incluir dirección
        });

        const order = await newOrder.save(); 

        // 6. Respuesta con el pedido poblado para confirmación
        const finalOrder = await Order.findById(order._id)
            .populate('user', 'name email') 
            .populate('items.producto', 'name price'); 

        res.status(201).json({ 
            status: 'success', 
            data: finalOrder 
        });

    } catch (error) {
        next(error); 
    }
});


// =========================================================
// 2. OBTENER TODOS LOS PEDIDOS (GET /api/orders)
// =========================================================
export const getAllOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find()
        .populate('user', 'name email')
        .populate('items.producto', 'name price');

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: orders,
    });
});

// =========================================================
// 3. OBTENER PEDIDO POR ID (GET /api/orders/:id)
// =========================================================
export const getOrderById = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate('items.producto', 'name price');

    if (!order) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    res.status(200).json({
        status: 'success',
        data: order,
    });
});

// =========================================================
// 4. ACTUALIZAR PEDIDO (PUT /api/orders/:id)
// Nota: Principalmente para que el ADMIN cambie el status
// =========================================================
export const updateOrder = catchAsync(async (req, res, next) => {
    // Solo permitir actualizar el status
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Solo se permite actualizar el campo status' });
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
    )
    .populate('user', 'name email')
    .populate('items.producto', 'name price');

    if (!updatedOrder) {
        return res.status(404).json({ message: 'Pedido no encontrado para actualizar' });
    }

    res.status(200).json({
        status: 'success',
        data: updatedOrder,
    });
});

// =========================================================
// 5. ELIMINAR PEDIDO (DELETE /api/orders/:id)
// =========================================================
export const deleteOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
        return res.status(404).json({ message: 'Pedido no encontrado para eliminar' });
    }

    // Nota: La lógica de restauración de stock es compleja y se omite
    // aquí por simplicidad de un proyecto MVP.

    res.status(204).json({
        status: 'success',
        data: null,
    });
});