// ficheiro: frontend/src/pages/CartPage.js

import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemText, IconButton, Box, Button, Paper } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

function CartPage() {
    const { cartItems, updateQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Meu Carrinho</Typography>
            {cartItems.length === 0 ? (
                <Typography>O seu carrinho está vazio.</Typography>
            ) : (
                <Paper elevation={3} sx={{ padding: 2 }}>
                    <List>
                        {cartItems.map(item => (
                            <ListItem key={item.id} divider>
                                <ListItemText
                                    primary={item.name}
                                    secondary={`R$ ${parseFloat(item.price).toFixed(2).replace('.', ',')}`}
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton onClick={() => updateQuantity(item.id, item.quantity - 1)}><RemoveCircleOutlineIcon /></IconButton>
                                    <Typography sx={{ margin: '0 10px' }}>{item.quantity}</Typography>
                                    <IconButton onClick={() => updateQuantity(item.id, item.quantity + 1)}><AddCircleOutlineIcon /></IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => removeFromCart(item.id)} sx={{ ml: 2 }}><DeleteIcon /></IconButton>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                    <Box sx={{ mt: 3, textAlign: 'right' }}>
                        <Typography variant="h5">
                            Total: R$ {total.toFixed(2).replace('.', ',')}
                        </Typography>
                        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/checkout')}>
                            Finalizar Compra
                        </Button>
                    </Box>
                </Paper>
            )}
        </Container>
    );
}

export default CartPage;