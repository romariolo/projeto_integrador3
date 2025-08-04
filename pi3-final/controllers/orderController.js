const db = require('../models');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const { Order, Product, User, Category, OrderItem } = db;

exports.createOrder = catchAsync(async (req, res, next) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    if (!productId || !quantity || quantity <= 0) {
        return next(new AppError('Por favor, forneça um produto e uma quantidade válida.', 400));
    }
    const transaction = await db.sequelize.transaction();
    try {
        const product = await Product.findByPk(productId, { transaction });
        if (!product) {
            throw new AppError(`Produto com ID ${productId} não encontrado.`, 404);
        }
        if (product.stock < quantity) {
            throw new AppError(`Estoque insuficiente para o produto "${product.name}". Disponível: ${product.stock}`, 400);
        }
        product.stock -= quantity;
        await product.save({ transaction });
        const totalAmount = product.price * quantity;
        const newOrder = await Order.create({ userId, totalAmount, shippingAddress: 'Venda Local', status: 'delivered', paymentMethod: 'pix' }, { transaction });
        await OrderItem.create({ orderId: newOrder.id, productId: product.id, quantity: quantity, price: product.price }, { transaction });
        await transaction.commit();
        const finalOrder = await Order.findByPk(newOrder.id, { include: [{ model: OrderItem, as: 'orderItems' }] });
        res.status(201).json({ status: 'success', message: 'Venda registrada com sucesso!', data: { order: finalOrder } });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.findAll({
        where: { userId: req.user.id },
        include: [{
            model: OrderItem,
            as: 'orderItems',
            include: { model: Product, as: 'Product', attributes: ['id', 'name', 'price', 'imageUrl', 'unit'] }
        }],
        order: [['createdAt', 'DESC']],
    });
    res.status(200).json({ status: 'success', results: orders.length, data: { orders } });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
    const order = await Order.findByPk(req.params.id, {
        include: [
            { model: User, as: 'buyer', attributes: ['id', 'name', 'email', 'phone'] },
            {
                model: OrderItem,
                as: 'orderItems',
                include: { model: Product, as: 'Product', attributes: ['id', 'name', 'price', 'imageUrl', 'unit'] }
            },
        ],
    });
    if (!order) return next(new AppError('Pedido não encontrado.', 404));
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
        return next(new AppError('Você não tem permissão para visualizar este pedido.', 403));
    }
    res.status(200).json({ status: 'success', data: { order } });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.findAll({
        include: [{
            model: User,
            as: 'buyer',
            attributes: ['id', 'name']
        }, {
            model: OrderItem,
            as: 'orderItems',
            include: {
                model: Product,
                as: 'Product',
                attributes: ['id', 'name', 'price', 'unit'],
                include: { model: Category, as: 'category', attributes: ['name'] }
            }
        }, ],
        order: [['createdAt', 'DESC']],
    });
    const salesHistory = orders.flatMap(order =>
        order.orderItems.map(item => ({
            id: order.id + '-' + item.productId,
            timestamp: order.createdAt,
            productName: item.Product ? item.Product.name : 'Produto Deletado',
            category: item.Product && item.Product.category ? item.Product.category.name : 'Sem Categoria',
            quantity: item.quantity,
            unit: item.Product ? item.Product.unit : '',
            price: parseFloat(item.price),
            total: item.quantity * parseFloat(item.price),
        }))
    );
    res.status(200).json({ status: 'success', results: salesHistory.length, data: { sales: salesHistory } });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body;
    if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        return next(new AppError('Status de pedido inválido.', 400));
    }
    const order = await Order.findByPk(req.params.id);
    if (!order) return next(new AppError('Pedido não encontrado.', 404));
    if (req.user.role !== 'admin') return next(new AppError('Você não tem permissão para atualizar o status deste pedido.', 403));
    order.status = status;
    await order.save();
    res.status(200).json({ status: 'success', data: { order } });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findByPk(req.params.id);
    if (!order) return next(new AppError('Pedido não encontrado.', 404));
    if (order.userId !== req.user.id && req.user.role !== 'admin') return next(new AppError('Você não tem permissão para cancelar este pedido.', 403));
    if (order.status !== 'delivered' && order.status !== 'cancelled') {
        const transaction = await db.sequelize.transaction();
        try {
            order.status = 'cancelled';
            await order.save({ transaction });
            const orderItems = await OrderItem.findAll({ where: { orderId: order.id }, transaction });
            for (const item of orderItems) {
                const product = await Product.findByPk(item.productId, { transaction });
                if (product) {
                    product.stock += item.quantity;
                    await product.save({ transaction });
                }
            }
            await transaction.commit();
            res.status(200).json({ status: 'success', message: 'Pedido cancelado e estoque revertido.', data: { order } });
        } catch (error) {
            await transaction.rollback();
            next(error);
        }
    } else {
        return next(new AppError(`Não é possível cancelar um pedido com status "${order.status}".`, 400));
    }
});

exports.createOrderFromCart = catchAsync(async (req, res, next) => {
    const { cartItems, shippingAddress, paymentMethod } = req.body;
    const userId = req.user.id;
    if (!cartItems || cartItems.length === 0) return next(new AppError('O carrinho não pode estar vazio.', 400));
    if (!shippingAddress || shippingAddress.trim() === '') return next(new AppError('Por favor, forneça um endereço de entrega.', 400));
    if (!['pix', 'cartao'].includes(paymentMethod)) return next(new AppError('Método de pagamento inválido.', 400));
    const transaction = await db.sequelize.transaction();
    try {
        let totalAmount = 0;
        const productIds = cartItems.map(item => item.id);
        const products = await Product.findAll({ where: { id: productIds }, transaction });
        const productMap = products.reduce((map, product) => { map[product.id] = product; return map; }, {});
        for (const item of cartItems) {
            const product = productMap[item.id];
            if (!product) throw new AppError(`Produto com ID ${item.id} não encontrado.`, 404);
            if (product.stock < item.quantity) throw new AppError(`Estoque insuficiente para o produto "${product.name}".`, 400);
            product.stock -= item.quantity;
            totalAmount += product.price * item.quantity;
        }
        await Promise.all(products.map(p => p.save({ transaction })));
        const newOrder = await Order.create({ userId, totalAmount, shippingAddress, paymentMethod, status: 'processing' }, { transaction });
        const orderItemsData = cartItems.map(item => ({ orderId: newOrder.id, productId: item.id, quantity: item.quantity, price: productMap[item.id].price }));
        await OrderItem.bulkCreate(orderItemsData, { transaction });
        await transaction.commit();
        res.status(201).json({ status: 'success', message: 'Pedido criado com sucesso!', data: { orderId: newOrder.id } });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
});

// NOVA FUNÇÃO PARA O VENDEDOR VER SEUS PEDIDOS
exports.getSellerOrders = catchAsync(async (req, res, next) => {
    const sellerId = req.user.id;

    const orders = await Order.findAll({
        include: [
            {
                model: OrderItem,
                as: 'orderItems',
                required: true,
                include: [{
                    model: Product,
                    as: 'Product',
                    where: { userId: sellerId },
                    required: true,
                }]
            },
            {
                model: User,
                as: 'buyer',
                attributes: ['name', 'email', 'phone']
            }
        ],
        order: [['createdAt', 'DESC']]
    });

    const sellerOrders = orders.map(order => {
        const filteredItems = order.orderItems.filter(item => item.Product.userId === sellerId);
        return {
            ...order.toJSON(),
            orderItems: filteredItems
        };
    });

    res.status(200).json({
        status: 'success',
        results: sellerOrders.length,
        data: {
            orders: sellerOrders
        }
    });
});

// NOVA FUNÇÃO PARA O VENDEDOR ATUALIZAR O ESTADO DE UM PEDIDO
exports.updateSellerOrderStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body;
    const { id: orderId } = req.params;
    const sellerId = req.user.id;

    if (!['processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        return next(new AppError('Status de pedido inválido.', 400));
    }

    const order = await Order.findByPk(orderId, {
        include: [{
            model: OrderItem,
            as: 'orderItems',
            include: [{ model: Product, as: 'Product' }]
        }]
    });

    if (!order) {
        return next(new AppError('Pedido não encontrado.', 404));
    }

    const isSellerOrder = order.orderItems.some(item => item.Product.userId === sellerId);

    if (!isSellerOrder && req.user.role !== 'admin') {
        return next(new AppError('Você não tem permissão para atualizar este pedido.', 403));
    }

    order.status = status;
    await order.save();

    res.status(200).json({
        status: 'success',
        data: {
            order,
        },
    });
});