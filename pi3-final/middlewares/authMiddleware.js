

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { User } = require('../models'); // Corrigido para importar do sítio certo

const protect = catchAsync(async (req, res, next) => {
    console.log('--- DENTRO DO MIDDLEWARE PROTECT ---');
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    console.log('Token recebido:', token); // LOG 1: Vamos ver se o token está a chegar

    if (!token) {
        return next(
            new AppError('Você não está logado! Por favor, faça login para ter acesso.', 401)
        );
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log('Token descodificado (ID do utilizador):', decoded.id); // LOG 2: Vamos ver o ID do utilizador

    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser) {
        return next(
            new AppError('O utilizador pertencente a este token não existe mais.', 401)
        );
    }

    console.log('Utilizador encontrado no banco de dados:', currentUser.name); // LOG 3: Vamos ver se o utilizador foi encontrado

    req.user = currentUser;
    next();
});

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError('Você não tem permissão para realizar esta ação.', 403)
            );
        }
        next();
    };
};

module.exports = { protect, restrictTo };