import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/Theme';
import './styles/index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
              <ThemeProvider theme={theme}>
                <App />
              </ThemeProvider>
            </SnackbarProvider>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
