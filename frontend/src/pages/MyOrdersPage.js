import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Container, Typography, Box, CircularProgress, Accordion,
    AccordionSummary, AccordionDetails, List, ListItem, ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await fetch('http://localhost:3000/api/orders/my-orders', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Não foi possível buscar seus pedidos.');
                }
                const data = await response.json();
                setOrders(data.data.orders || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Typography color="error" align="center" sx={{ mt: 5 }}>{error}</Typography>;
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Meus Pedidos
            </Typography>
            {orders.length === 0 ? (
                <Typography>Você ainda não fez nenhum pedido.</Typography>
            ) : (
                orders.map(order => (
                    <Accordion key={order.id} sx={{ mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                Pedido #{order.id}
                            </Typography>
                            <Typography sx={{ color: 'text.secondary' }}>
                                Data: {new Date(order.createdAt).toLocaleDateString()} - Total: R$ {parseFloat(order.totalAmount).toFixed(2).replace('.', ',')}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <List>
                                {order.orderItems.map(item => (
                                    <ListItem key={item.Product.id}>
                                        <ListItemText
                                            primary={`${item.quantity}x ${item.Product.name}`}
                                            secondary={`Preço Unitário: R$ ${parseFloat(item.price).toFixed(2).replace('.', ',')}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                ))
            )}
        </Container>
    );
}

export default MyOrdersPage;