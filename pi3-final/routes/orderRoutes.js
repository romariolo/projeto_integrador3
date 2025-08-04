const express = require('express');
const orderController = require('../controllers/orderController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/my-orders', orderController.getMyOrders);
router.get('/seller', restrictTo('vendedor', 'admin'), orderController.getSellerOrders);
router.post('/', orderController.createOrder);
router.post('/checkout', orderController.createOrderFromCart);
router.patch('/:id/cancel', orderController.cancelOrder);

// Rota para o vendedor atualizar o estado de um pedido
router.patch('/:id/seller-status', restrictTo('vendedor', 'admin'), orderController.updateSellerOrderStatus);

router.get('/:id', orderController.getOrderById);

// Rotas apenas para Admin
router.use(restrictTo('admin'));
router.get('/', orderController.getAllOrders);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;