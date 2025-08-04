import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Adiciona um item ao carrinho ou incrementa sua quantidade
    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    };

    // Remove um item completamente do carrinho
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    // Atualiza a quantidade de um item (aumenta ou diminui)
    const updateQuantity = (productId, quantity) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
            ).filter(item => item.quantity > 0) // Remove o item se a quantidade chegar a 0
        );
    };

    // Limpa todos os itens do carrinho (usado após o checkout)
    const clearCart = () => {
        setCartItems([]);
    };
    
    // Calcula o número total de itens no carrinho para o ícone do header
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    // Agrupa todas as funções e estados para serem disponibilizados para a aplicação
    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        clearCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook customizado para facilitar o uso do contexto em outros componentes
export const useCart = () => {
    return useContext(CartContext);
};