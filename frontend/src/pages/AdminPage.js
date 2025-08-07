import React, { useEffect, useState, useCallback } from "react";
import "../styles/AdminPage.css";

import ManageProductsTab from "../components/admin/ManageProductsTab";
import ManageSalesTab from "../components/admin/ManageSalesTab";
import StockViewTab from "../components/admin/StockViewTab";
import NotificationsTab from "../components/admin/NotificationsTab";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState("produtos");

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem("token")}` };
      const [productsRes, categoriesRes, salesRes] = await Promise.all([
        fetch('http://localhost:3000/api/products', { headers }),
        fetch('http://localhost:3000/api/categories', { headers }),
        fetch('http://localhost:3000/api/orders', { headers })
      ]);

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      const salesData = await salesRes.json();
      
      setProducts(productsData.data.products || []);
      setCategories(categoriesData.data.categories || []);
      setSales(salesData.data.sales || []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      alert("Sessão expirada ou erro de rede. Faça login novamente.");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateProduct = async (productForm) => {
    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(productForm)
      });
      if (!response.ok) throw new Error('Erro ao cadastrar produto.');
      alert('Produto cadastrado com sucesso!');
      await fetchData(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCreateCategory = async (categoryName) => {
    try {
      const response = await fetch('http://localhost:3000/api/categories', {
        method: 'POST', headers: getAuthHeaders(), body: JSON.stringify({ name: categoryName })
      });
      if (!response.ok) throw new Error('Erro ao criar categoria.');
      await fetchData(false);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCreateSale = async (saleForm) => {
    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          productId: saleForm.productId,
          quantity: parseInt(saleForm.quantity, 10)
        })
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Erro ao registrar venda.');
      }
      alert('Venda registrada com sucesso!');
      await fetchData(false);
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <div className="admin-layout">Carregando painel de administração...</div>;
  }

  const renderContent = () => {
    switch (activeMenu) {
      case "produtos":
        return <ManageProductsTab 
                  categories={categories}
                  onProductSubmit={handleCreateProduct}
                  onCategorySubmit={handleCreateCategory}
               />;
      case "estoque":
        return <StockViewTab products={products} categories={categories} />;
      case "vendas":
        return <ManageSalesTab 
                  products={products} 
                  sales={sales} 
                  onSaleSubmit={handleCreateSale} 
                />;
      case "notificacoes":
        return <NotificationsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <h3>Menu</h3>
        <nav className="sidebar-menu">
          <button className={`menu-item ${activeMenu === "produtos" ? "active" : ""}`} onClick={() => setActiveMenu("produtos")}>Produtos</button>
          <button className={`menu-item ${activeMenu === "estoque" ? "active" : ""}`} onClick={() => setActiveMenu("estoque")}>Estoque</button>
          <button className={`menu-item ${activeMenu === "vendas" ? "active" : ""}`} onClick={() => setActiveMenu("vendas")}>Vendas</button>
          <button className={`menu-item ${activeMenu === "notificacoes" ? "active" : ""}`} onClick={() => setActiveMenu("notificacoes")}>Notificações</button>
        </nav>
      </div>
      <div className="admin-main">
        <h2>Painel do Administrador</h2>
      <div className="tab-content">
    {renderContent()}
  </div>
</div>

    </div>
  );
}

export default AdminPage;
