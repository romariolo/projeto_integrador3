const db = require('../models');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');

const { Product, User, Category } = db;

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '..', 'uploads', 'products');
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `product-${Date.now()}.${ext}`);
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Não é uma imagem!', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

exports.uploadProductImage = upload.single('image');

exports.createProduct = catchAsync(async (req, res, next) => {
    const { name, description, price, stock, categoryId, unit, image } = req.body;
    const userId = req.user.id;

    const category = await Category.findByPk(categoryId);
    if (!category) return next(new AppError('Categoria não encontrada.', 404));

    let imageUrl = null;

    if (req.file) {
        imageUrl = `/uploads/products/${req.file.filename}`;
    } else if (image && image.startsWith('data:image')) {
        try {
            const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, 'base64');
            const ext = image.substring(image.indexOf('/') + 1, image.indexOf(';base64'));
            const filename = `product-${Date.now()}.${ext}`;
            const uploadDir = path.join(__dirname, '..', 'uploads', 'products');
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
            const imagePath = path.join(uploadDir, filename);
            fs.writeFileSync(imagePath, buffer);
            imageUrl = `/uploads/products/${filename}`;
        } catch {
            return next(new AppError('Erro ao processar a imagem.', 400));
        }
    }

    const productData = {
        name,
        description,
        price,
        stock,
        categoryId,
        userId,
        unit,
        imageUrl,
        status: stock > 0 ? 'disponivel' : 'indisponivel'
    };

    const newProduct = await Product.create(productData);

    res.status(201).json({
        status: 'success',
        data: { product: newProduct },
    });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
    const query = {
        include: [
            { model: User, as: 'producer', attributes: ['id', 'name', 'email', 'phone'] },
            { model: Category, as: 'category', attributes: ['id', 'name'] },
        ],
        where: {}
    };

    if (req.query.name) query.where.name = { [Op.like]: `%${req.query.name}%` };
    if (req.query.price) {
        if (req.query.price.gte) query.where.price = { ...query.where.price, [Op.gte]: req.query.price.gte };
        if (req.query.price.lte) query.where.price = { ...query.where.price, [Op.lte]: req.query.price.lte };
    }
    if (req.query.categoryId) query.where.categoryId = req.query.categoryId;
    if (req.query.status) query.where.status = req.query.status;

    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').map(field => field.startsWith('-') ? [field.substring(1), 'DESC'] : [field, 'ASC']);
        query.order = sortBy;
    } else {
        query.order = [['createdAt', 'DESC']];
    }

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const offset = (page - 1) * limit;

    query.limit = limit;
    query.offset = offset;

    const { count, rows: products } = await Product.findAndCountAll(query);

    res.status(200).json({
        status: 'success',
        results: products.length,
        total: count,
        data: { products },
    });
});

exports.getProductById = catchAsync(async (req, res, next) => {
    const product = await Product.findByPk(req.params.id, {
        include: [
            { model: User, as: 'producer', attributes: ['id', 'name', 'email', 'phone'] },
            { model: Category, as: 'category', attributes: ['id', 'name'] },
        ],
    });

    if (!product) return next(new AppError('Nenhum produto encontrado com este ID.', 404));

    res.status(200).json({
        status: 'success',
        data: { product },
    });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
    const { name, description, price, stock, categoryId, unit, image } = req.body;

    const product = await Product.findByPk(req.params.id);

    if (!product) return next(new AppError('Produto não encontrado.', 404));
    if (product.userId !== req.user.id && req.user.role !== 'admin') return next(new AppError('Sem permissão.', 403));

    if (req.file || (image && image.startsWith('data:image'))) {
        if (product.imageUrl) {
            const oldPath = path.join(__dirname, '..', product.imageUrl);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
    }

    if (req.file) {
        product.imageUrl = `/uploads/products/${req.file.filename}`;
    } else if (image && image.startsWith('data:image')) {
        try {
            const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, 'base64');
            const ext = image.substring(image.indexOf('/') + 1, image.indexOf(';base64'));
            const filename = `product-${Date.now()}.${ext}`;
            const imagePath = path.join(__dirname, '..', 'uploads', 'products', filename);
            fs.writeFileSync(imagePath, buffer);
            product.imageUrl = `/uploads/products/${filename}`;
        } catch {
            return next(new AppError('Erro ao processar a nova imagem.', 400));
        }
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock !== undefined ? stock : product.stock;
    product.unit = unit || product.unit;
    product.categoryId = categoryId || product.categoryId;

    if (stock !== undefined) product.status = stock > 0 ? 'disponivel' : 'indisponivel';

    if (categoryId && categoryId !== product.categoryId) {
        const newCategory = await Category.findByPk(categoryId);
        if (!newCategory) return next(new AppError('Categoria inválida.', 404));
    }

    await product.save();

    res.status(200).json({
        status: 'success',
        data: { product },
    });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByPk(req.params.id);

    if (!product) return next(new AppError('Produto não encontrado.', 404));
    if (product.userId !== req.user.id && req.user.role !== 'admin') return next(new AppError('Sem permissão.', 403));

    if (product.imageUrl) {
        const imagePath = path.join(__dirname, '..', product.imageUrl);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await product.destroy();

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.getMyProducts = catchAsync(async (req, res, next) => {
    const products = await Product.findAll({
        where: { userId: req.user.id },
        include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
        order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
        status: 'success',
        results: products.length,
        data: { products },
    });
});
