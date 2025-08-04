// ficheiro: frontend/src/pages/SellerDashboardPage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import {
    Container, Typography, List, ListItem, ListItemText, Button, Box,
    CircularProgress, Paper, Accordion, AccordionSummary, AccordionDetails, Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddProductModal from '../components/seller/AddProductModal';
import ConfirmDeleteModal from '../components/seller/ConfirmDeleteModal';
import { useSnackbar } from 'notistack';

function SellerDashboardPage() {
    const [myProducts, setMyProducts] = useState([]);
    const [sellerOrders, setSellerOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const { fetchProducts: fetchAllProducts } = useProducts();
    const { enqueueSnackbar } = useSnackbar();

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchData = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [productsRes, ordersRes] = await Promise.all([
                fetch('http://localhost:3000/api/products/my', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('http://localhost:3000/api/orders/seller', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            if (!productsRes.ok || !ordersRes.ok) throw new Error('Não foi possível buscar os dados do painel.');
            const productsData = await productsRes.json();
            const ordersData = await ordersRes.json();
            setMyProducts(productsData.data.products || []);
            setSellerOrders(ordersData.data.orders || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleProductUpdate = () => {
        fetchData();
        fetchAllProducts();
    };

    const handleUpdateOrderStatus = async (orderId, status) => {
        try {
            const response = await fetch(`http://localhost:3000/api/orders/${orderId}/seller-status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ status })
            });
            if (!response.ok) throw new Error('Falha ao atualizar o estado do pedido.');
            enqueueSnackbar('Estado do pedido atualizado com sucesso!', { variant: 'success' });
            fetchData();
        } catch (err) {
            enqueueSnackbar(err.message, { variant: 'error' });
        }
    };

    const handleOpenEditModal = (product) => { setSelectedProduct(product); setEditModalOpen(true); };
    const handleOpenDeleteModal = (product) => { setSelectedProduct(product); setDeleteModalOpen(true); };
    const handleCloseModals = () => { setSelectedProduct(null); setEditModalOpen(false); setDeleteModalOpen(false); };
    
    const handleDeleteProduct = async () => {
        if (!selectedProduct) return;
        try {
            await fetch(`http://localhost:3000/api/products/${selectedProduct.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            handleProductUpdate();
            handleCloseModals();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (error) return <Typography color="error" align="center" sx={{ mt: 4 }}>{error}</Typography>;

    return (
        <>
            <AddProductModal open={editModalOpen} handleClose={handleCloseModals} onProductUpdated={handleProductUpdate} productToEdit={selectedProduct} />
            <ConfirmDeleteModal open={deleteModalOpen} handleClose={handleCloseModals} onConfirm={handleDeleteProduct} productName={selectedProduct?.name} />
            
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 2 }}>
                    <Typography variant="h4" component="h1">Meu Painel de Vendedor</Typography>
                    <Button variant="contained" onClick={() => handleOpenEditModal(null)}>Adicionar Novo Produto</Button>
                </Box>

                <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
                    <Typography variant="h5" gutterBottom>Pedidos Recebidos</Typography>
                    {sellerOrders.length === 0 ? (
                        <Typography>Nenhum pedido recebido ainda.</Typography>
                    ) : (
                        sellerOrders.map(order => (
                            <Accordion key={order.id}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>Pedido #{order.id}</Typography>
                                    <Typography sx={{ color: 'text.secondary', mr: 2 }}>Comprador: {order.buyer.name}</Typography>
                                    <Chip label={order.status} color={order.status === 'delivered' ? 'success' : 'warning'} size="small" />
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="subtitle2"><strong>Endereço de Entrega:</strong> {order.shippingAddress}</Typography>
                                    <List>
                                        {order.orderItems.map(item => (
                                            <ListItem key={item.id}><ListItemText primary={`${item.quantity}x ${item.Product.name}`} /></ListItem>
                                        ))}
                                    </List>
                                    {order.status !== 'delivered' && (
                                        <Button
                                            variant="contained"
                                            startIcon={<CheckCircleIcon />}
                                            onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                                        >
                                            Marcar como Entregue
                                        </Button>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        ))
                    )}
                </Paper>

                <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h5" gutterBottom>Meus Produtos Cadastrados</Typography>
                    {myProducts.length === 0 ? (
                        <Typography>Você ainda não cadastrou nenhum produto.</Typography>
                    ) : (
                        <List>
                            {myProducts.map(product => (
                                <ListItem key={product.id} divider secondaryAction={
                                    <Box>
                                        <Button variant="outlined" size="small" sx={{ mr: 1 }} onClick={() => handleOpenEditModal(product)}>Editar</Button>
                                        <Button variant="outlined" size="small" color="error" onClick={() => handleOpenDeleteModal(product)}>Excluir</Button>
                                    </Box>
                                }>
                                    <ListItemText primary={product.name} secondary={`Preço: R$ ${parseFloat(product.price).toFixed(2).replace('.', ',')} - Estoque: ${product.stock}`} />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Paper>
            </Container>
        </>
    );
}

export default SellerDashboardPage;