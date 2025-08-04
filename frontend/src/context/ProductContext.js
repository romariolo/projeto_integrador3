// ficheiro: frontend/src/context/ProductContext.js

import React, { createContext, useContext, useState, useCallback } from 'react';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Usamos useCallback para que a função não seja recriada a cada renderização
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3000/api/products');
            if (!response.ok) {
                throw new Error('Falha ao buscar produtos.');
            }
            const data = await response.json();
            setProducts(data.data.products || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const value = {
        products,
        loading,
        error,
        fetchProducts, // Exportamos a função para que outros componentes possam pedir uma atualização
    };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

// Hook customizado para facilitar o uso
export const useProducts = () => {
    return useContext(ProductContext);
};