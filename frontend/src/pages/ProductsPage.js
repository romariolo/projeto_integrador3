import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import {
    Card, CardContent, CardMedia, Typography, Grid, Box,
    CircularProgress, CardActionArea, Container, TextField, Button, ButtonGroup, Pagination
} from '@mui/material';

function ProductsPage() {
    const { products, loading, error, fetchProducts } = useProducts();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const PRODUCTS_PER_PAGE = 15;

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

    const pageCount = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

    const handlePageChange = (_, value) => {
        setCurrentPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    sx={{ mb: 2 }}
                />
                <ButtonGroup variant="outlined" sx={{ flexWrap: 'wrap', gap: 1 }}>
                    <Button
                        variant={!selectedCategory ? 'contained' : 'outlined'}
                        onClick={() => {
                            setSelectedCategory(null);
                            setCurrentPage(1);
                        }}
                    >
                        Todos
                    </Button>
                    {categories.map(category => (
                        <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? 'contained' : 'outlined'}
                            onClick={() => {
                                setSelectedCategory(category.id);
                                setCurrentPage(1);
                            }}
                        >
                            {category.name}
                        </Button>
                    ))}
                </ButtonGroup>
            </Box>

            <Grid container spacing={3}>
                {paginatedProducts.length > 0 ? (
                    paginatedProducts.map(({ id, name, price, imageUrl, unit }) => (
                        <Grid item xs={12} sm={6} md={2.4} key={id}>
                            <CardActionArea
                                component={Link}
                                to={`/produtos/${id}`}
                                sx={{ textDecoration: 'none', color: 'inherit', height: '100%' }}
                            >
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)'
                                        }
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={imageUrl
                                            ? `http://localhost:3000${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`
                                            : 'https://placehold.co/200x200?text=Sem+Imagem'}
                                        alt={name}
                                        sx={{
                                            width: 200,
                                            height: 200,
                                            objectFit: 'cover',
                                            alignSelf: 'center',
                                            mt: 2
                                        }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://placehold.co/200x200?text=Imagem+Indisponível';
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
                    ))
                ) : (
                    <Typography sx={{ mt: 4, width: '100%' }} align="center">
                        Nenhum produto encontrado com os filtros selecionados.
                    </Typography>
                )}
            </Grid>

            {pageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={pageCount}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}
        </Container>
    );
}

export default ProductsPage;
