// ficheiro: frontend/src/App.js

import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"; // Importe o useLocation
import { useAuth } from "./context/AuthContext";
import { Box, CssBaseline } from '@mui/material';
import "./styles/App.css";

// Importações
import Header from "./components/Header";
import Footer from "./components/layout/Footer";
import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from './pages/RegisterPage';
import AdminPage from "./pages/AdminPage";
import SellerDashboardPage from "./pages/SellerDashboardPage";
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import MyOrdersPage from './pages/MyOrdersPage';
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Hook para saber a URL atual

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Define em que páginas o cabeçalho e o rodapé devem aparecer
  const showLayout = !['/login', '/register'].includes(location.pathname);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      {showLayout && <Header isLoggedIn={!!user} onLogout={handleLogout} />}

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<ProductsPage />} />
          <Route path="/produtos/:productId" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} /> {/* Não precisa mais do onBack */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pedido-confirmado" element={<OrderSuccessPage />} />

          {/* Rotas Protegidas */}
          <Route path="/carrinho" element={<ProtectedRoute allowedRoles={['user', 'vendedor', 'admin']}><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute allowedRoles={['user', 'vendedor', 'admin']}><CheckoutPage /></ProtectedRoute>} />
          <Route path="/meus-pedidos" element={<ProtectedRoute allowedRoles={['user', 'vendedor', 'admin']}><MyOrdersPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPage /></ProtectedRoute>} />
          <Route path="/painel-vendedor" element={<ProtectedRoute allowedRoles={['vendedor', 'admin']}><SellerDashboardPage /></ProtectedRoute>} />
        </Routes>
      </Box>
      
      {showLayout && <Footer />}
    </Box>
  );
}

export default App;