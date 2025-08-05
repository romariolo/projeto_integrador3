import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import { Container, Grid, Box, Typography, Button, CircularProgress } from '@mui/material';

function ProductDetailPage() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { productId } = useParams();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3000/api/products/${productId}`);
                if (!response.ok) {
                    throw new Error('Produto não encontrado.');
                }
                const data = await response.json();
                setProduct(data.data.product);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {
        if (!user) {
            enqueueSnackbar('Precisa de fazer login para adicionar itens ao carrinho.', { variant: 'info' });
            navigate('/login');
            return;
        }

        if (product) {
            addToCart(product);
            enqueueSnackbar(`${product.name} adicionado ao carrinho!`, { variant: 'success' });
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Typography color="error" align="center" sx={{ mt: 5 }}>Erro: {error}</Typography>;
    }

    if (!product) {
        return <Typography align="center" sx={{ mt: 5 }}>Produto não encontrado.</Typography>;
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Box
                        component="img"
                        sx={{
                            width: 300,
                            height: 300,
                            borderRadius: 2,
                            boxShadow: 3,
                            objectFit: 'cover',
                            display: 'block',
                            mx: 'auto'
                        }}
                        src={product.imageUrl ? `http://localhost:3000${product.imageUrl}` : 'https://placehold.co/300x300?text=Sem+Imagem'}
                        alt={product.name}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/300x300?text=Imagem+Indisponível';
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        {product.name}
                    </Typography>
                    <Typography variant="h5" color="text.secondary" paragraph>
                        R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}
                        {product.unit && ` / ${product.unit}`}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        {product.description || "Este produto não tem uma descrição detalhada."}
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <Button variant="contained" size="large" onClick={handleAddToCart}>
                            Adicionar ao Carrinho
                        </Button>
                        <Button variant="contained" size="small" color="warning" onClick={handleBack}>
                            Voltar
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}

export default ProductDetailPage;
