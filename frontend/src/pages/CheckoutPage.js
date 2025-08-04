// ficheiro: frontend/src/pages/CheckoutPage.js

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Button, Paper, TextField,
    CircularProgress, FormControl, RadioGroup, FormControlLabel, Radio
} from '@mui/material'; // A importação de 'FormLabel' foi removida
import { useSnackbar } from 'notistack';

function CheckoutPage() {
    const { cartItems, clearCart } = useCart();
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    
    const [shippingAddress, setShippingAddress] = useState(user?.address || '');
    const [paymentMethod, setPaymentMethod] = useState('pix');
    const [loading, setLoading] = useState(false);

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleConfirmOrder = async () => {
        if (!shippingAddress.trim()) {
            enqueueSnackbar('Por favor, preencha o endereço de entrega.', { variant: 'warning' });
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/orders/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ cartItems, shippingAddress, paymentMethod })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Falha ao finalizar o pedido.');
            }
            
            clearCart();
            navigate('/pedido-confirmado');

        } catch (err) {
            enqueueSnackbar(err.message, { variant: 'error' });
            setLoading(false);
        }
    };

    return (
        <Container sx={{ mt: 4 }} maxWidth="md">
            <Typography variant="h4" gutterBottom>Finalizar Compra</Typography>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Typography variant="h6" gutterBottom>1. Endereço de Entrega</Typography>
                <TextField
                    label="Endereço Completo (Rua, Número, Bairro, Cidade)"
                    fullWidth
                    multiline
                    rows={3}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    margin="normal"
                    required
                />

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>2. Método de Pagamento (Simulação)</Typography>
                <FormControl component="fieldset" margin="normal">
                    <RadioGroup row value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <FormControlLabel value="pix" control={<Radio />} label="Pix" />
                        <FormControlLabel value="cartao" control={<Radio />} label="Cartão de Crédito" />
                    </RadioGroup>
                </FormControl>
                
                {paymentMethod === 'pix' && (
                    <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 1 }}>
                        <Typography>Para pagar com Pix, utilize a chave: <strong>(11) 99999-9999</strong></Typography>
                        <Typography variant="caption">Isto é apenas uma simulação. Pode confirmar o pedido.</Typography>
                    </Box>
                )}
                {paymentMethod === 'cartao' && (
                     <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 1 }}>
                        <Typography>Os detalhes do cartão não são necessários.</Typography>
                        <Typography variant="caption">Isto é apenas uma simulação. Pode confirmar o pedido.</Typography>
                    </Box>
                )}

                <Box sx={{ mt: 4, textAlign: 'right' }}>
                    <Typography variant="h5">
                        Total do Pedido: R$ {total.toFixed(2).replace('.', ',')}
                    </Typography>
                    <Button variant="contained" size="large" onClick={handleConfirmOrder} disabled={loading} sx={{ mt: 2 }}>
                        {loading ? <CircularProgress size={24} /> : 'Confirmar Pedido'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default CheckoutPage;