// ficheiro: pi3-final/routes/productRoutes.js

const express = require('express');
const productController = require('../controllers/productController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// --- Rotas Públicas ---
// Estas são acessíveis por qualquer pessoa.
router.use('/:productId/reviews', reviewRouter);
router.get('/', productController.getAllProducts);

// --- Rotas Protegidas ---
// A rota /my é específica e precisa de vir ANTES da rota genérica /:id.
// Ela também precisa do middleware 'protect' para saber quem é o utilizador.
router.get('/my', protect, productController.getMyProducts);

// A rota /:id é pública e vem DEPOIS da rota /my.
router.get('/:id', productController.getProductById);

// --- Rotas Restritas a Vendedores/Admins ---
// Estas rotas exigem login E uma permissão específica.
router.post('/',
    protect,
    restrictTo('admin', 'vendedor'),
    productController.uploadProductImage,
    productController.createProduct
);

router.patch('/:id',
    protect,
    restrictTo('admin', 'vendedor'),
    productController.uploadProductImage,
    productController.updateProduct
);

router.delete('/:id',
    protect,
    restrictTo('admin', 'vendedor'),
    productController.deleteProduct
);

module.exports = router;