// ficheiro: frontend/src/components/seller/AddProductModal.js

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    Modal, Box, Typography, TextField, Button,
    Select, MenuItem, FormControl, InputLabel, CircularProgress
} from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function AddProductModal({ open, handleClose, onProductUpdated, productToEdit }) {
    const [form, setForm] = useState({ name: '', price: '', unit: '', stock: '', categoryId: '', image: '' });
    const [imagePreview, setImagePreview] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { token } = useAuth();
    
    useEffect(() => {
        if (open) {
            // Limpa o estado anterior ao abrir o modal
            setError('');
            setLoading(false);

            // Busca as categorias
            fetch('http://localhost:3000/api/categories')
                .then(res => res.json())
                .then(data => setCategories(data.data.categories || []));

            // Preenche o formulário
            if (productToEdit) {
                setForm({
                    name: productToEdit.name,
                    price: productToEdit.price,
                    unit: productToEdit.unit || '',
                    stock: productToEdit.stock,
                    categoryId: productToEdit.categoryId,
                    image: ""
                });
                setImagePreview(productToEdit.imageUrl ? `http://localhost:3000${productToEdit.imageUrl}` : null);
            } else {
                setForm({ name: '', price: '', unit: '', stock: '', categoryId: '', image: '' });
                setImagePreview(null);
            }
        }
    }, [open, productToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(prev => ({ ...prev, image: reader.result }));
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const isEditing = !!productToEdit;
        const url = isEditing
            ? `http://localhost:3000/api/products/${productToEdit.id}`
            : 'http://localhost:3000/api/products';
        const method = isEditing ? 'PATCH' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(form)
            });

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Erro ao guardar o produto.');
            } else {
                 if (!response.ok) {
                    const textError = await response.text();
                    throw new Error(textError || 'O servidor retornou um erro inesperado.');
                }
            }
            onProductUpdated();
            handleClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style} component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" component="h2">
                    {productToEdit ? 'Editar Produto' : 'Adicionar Novo Produto'}
                </Typography>
                <TextField name="name" label="Nome do produto" value={form.name} onChange={handleChange} fullWidth margin="normal" required />
                <TextField name="price" label="Preço" type="number" step="0.01" value={form.price} onChange={handleChange} fullWidth margin="normal" required />
                <TextField name="unit" label="Unidade (kg, un, litro...)" value={form.unit} onChange={handleChange} fullWidth margin="normal" />
                <TextField name="stock" label="Estoque" type="number" value={form.stock} onChange={handleChange} fullWidth margin="normal" required />
                <FormControl fullWidth margin="normal" required>
                    <InputLabel id="category-select-label">Categoria</InputLabel>
                    <Select
                        labelId="category-select-label"
                        name="categoryId"
                        value={form.categoryId}
                        label="Categoria"
                        onChange={handleChange}
                    >
                        {categories.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <Box sx={{ mt: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button variant="outlined" component="label">
                        Escolher Imagem
                        <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                    </Button>
                    {imagePreview && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">Pré-visualização:</Typography>
                            <Box
                                component="img"
                                sx={{ height: 60, width: 60, objectFit: 'cover', borderRadius: 1 }}
                                src={imagePreview}
                                alt="Pré-visualização"
                            />
                        </Box>
                    )}
                </Box>
                {error && <Typography color="error">{error}</Typography>}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={handleClose} sx={{ mr: 1 }}>Cancelar</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : (productToEdit ? 'Guardar Alterações' : 'Cadastrar')}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default AddProductModal;