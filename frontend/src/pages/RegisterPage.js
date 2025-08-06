import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Container, Box, Typography, TextField, Button, CircularProgress,
    FormControl, FormLabel, RadioGroup, FormControlLabel, Radio
} from '@mui/material';

function RegisterPage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: ''
    });
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, role: role })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Erro ao criar conta.');
            }

            login(data.data.user, data.token);
            
            if (data.data.user.role === 'vendedor') {
                navigate('/painel-vendedor');
            } else {
                navigate('/');
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Criar Nova Conta
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <FormControl component="fieldset" margin="normal">
                        <FormLabel component="legend">Eu quero</FormLabel>
                        <RadioGroup row value={role} onChange={handleRoleChange}>
                            <FormControlLabel value="user" control={<Radio />} label="Comprar" />
                            <FormControlLabel value="vendedor" control={<Radio />} label="Vender" />
                        </RadioGroup>
                    </FormControl>

                    {/* CORREÇÃO: Adicionadas as propriedades value e onChange */}
                    <TextField
                        name="name"
                        label="Nome Completo"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        autoFocus
                    />
                    <TextField
                        name="email"
                        label="Endereço de Email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="password"
                        label="Senha"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="phone"
                        label="Telefone (Opcional)"
                        value={form.phone}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="address"
                        label="Endereço (Opcional)"
                        value={form.address}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    
                    {error && <Typography color="error" align="center" sx={{ mt: 1 }}>{error}</Typography>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Cadastrar'}
                    </Button>
                    <Typography align="center">
                        Já tem uma conta?{' '}
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                            Faça Login
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
}

export default RegisterPage;