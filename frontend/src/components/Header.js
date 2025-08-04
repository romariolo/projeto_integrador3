// ficheiro: frontend/src/components/Header.js

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

// Importando os componentes do Material-UI para o novo cabeçalho
import { AppBar, Toolbar, Typography, Button, Badge, IconButton, Box, Menu, MenuItem } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircle from '@mui/icons-material/AccountCircle';
import StorefrontIcon from '@mui/icons-material/Storefront'; // Ícone para o logo

function Header({ onLogout }) {
  const { user } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null); // Estado para controlar o menu

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
  };

  return (
    // Usamos o AppBar do MUI, que já pega a cor primária do nosso tema
    <AppBar position="static" elevation={1}>
      <Toolbar>
        {/* Secção do Logo e Título */}
        <Box
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            color: 'inherit',
            textDecoration: 'none'
          }}
        >
          <StorefrontIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            Sertão Livre
          </Typography>
        </Box>

        {/* Secção dos Botões e Ícones da Direita */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" component={Link} to="/carrinho">
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {user ? (
            <div>
              <IconButton size="large" onClick={handleMenu} color="inherit">
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2">Olá, {user.name.split(' ')[0]}</Typography>
                </MenuItem>
                
                {(user.role === 'admin' || user.role === 'vendedor') && (
                  <MenuItem onClick={() => handleNavigate(user.role === 'admin' ? '/admin' : '/painel-vendedor')}>
                    Meu Painel
                  </MenuItem>
                )}
                
                <MenuItem onClick={() => handleNavigate('/meus-pedidos')}>Meus Pedidos</MenuItem>
                
                <MenuItem onClick={() => {
                  handleClose();
                  onLogout();
                }}>Sair</MenuItem>
              </Menu>
            </div>
          ) : (
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;