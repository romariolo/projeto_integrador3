import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import {
    Card, CardContent, CardMedia, Typography, Grid, Box,
    CircularProgress, CardActionArea, Container, TextField, Button, ButtonGroup
} from '@mui/material';

function ProductsPage() {
    const { products, loading, error, fetchProducts } = useProducts();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();

        fetch('http://localhost:3000/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data.data.categories || []));
    }, [fetchProducts]);

    const filteredProducts = products.filter(product => {
        if (selectedCategory && product.categoryId !== selectedCategory) return false;
        if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }
    if (error) {
        return <Typography color="error" align="center" sx={{ mt: 4 }}>{error}</Typography>;
    }

    return (
        <Container sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>Nossos Produtos</Typography>
                <TextField
                    fullWidth
                    label="Buscar por nome do produto..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <ButtonGroup variant="outlined">
                    <Button
                        variant={!selectedCategory ? 'contained' : 'outlined'}
                        onClick={() => setSelectedCategory(null)}
                    >
                        Todos
                    </Button>
                    {categories.map(category => (
                        <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? 'contained' : 'outlined'}
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            {category.name}
                        </Button>
                    ))}
                </ButtonGroup>
            </Box>

            <Grid container spacing={3}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(({ id, name, price, imageUrl, unit }) => {
                        console.log('🔍 imageUrl do produto:', imageUrl);

                        return (
                            <Grid item xs={12} sm={6} md={4} key={id}>
                                <CardActionArea
                                    component={Link}
                                    to={`/produtos/${id}`}
                                    sx={{ textDecoration: 'none', color: 'inherit', height: '100%' }}
                                >
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <CardMedia
                                            component="img"
                                            image={imageUrl
                                                ? `http://localhost:3000${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`
                                                : 'https://placehold.co/100x100?text=Sem+Imagem'}
                                            alt={name}
                                            sx={{ width: 100, height: 100, objectFit: 'cover', alignSelf: 'center', mt: 2 }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://placehold.co/100x100?text=Imagem+Indisponível';
                                            }}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography gutterBottom variant="h6" component="div">{name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                R$ {parseFloat(price).toFixed(2).replace(".", ",")}
                                                {unit && ` / ${unit}`}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </CardActionArea>
                            </Grid>
                        );
                    })
                ) : (
                    <Typography sx={{ mt: 4, width: '100%' }} align="center">
                        Nenhum produto encontrado com os filtros selecionados.
                    </Typography>
                )}
            </Grid>
        </Container>
    );
}

export default ProductsPage;
