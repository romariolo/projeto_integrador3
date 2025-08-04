// ficheiro: pi3-final/models/Order.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        shippingAddress: {
            type: DataTypes.STRING,
            allowNull: false, // O endereço agora é obrigatório
        },
        // NOVO CAMPO para o método de pagamento
        paymentMethod: {
            type: DataTypes.ENUM('pix', 'cartao'),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
            defaultValue: 'processing', // O pedido já entra como "em processamento"
        },
    });

    return Order;
};