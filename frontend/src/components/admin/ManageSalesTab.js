import React, { useState } from 'react';

function ManageSalesTab({ products, sales, onSaleSubmit }) {
  const [saleForm, setSaleForm] = useState({ productId: "", quantity: 1 });

  const handleSaleChange = (e) => {
    const { name, value } = e.target;
    setSaleForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaleSubmit = (e) => {
    e.preventDefault();
    const product = products.find((p) => p.id === parseInt(saleForm.productId));
    const quantity = parseInt(saleForm.quantity);

    if (!product || quantity <= 0 || quantity > product.stock) {
      alert("Estoque insuficiente ou entrada inválida.");
      return;
    }
    
    onSaleSubmit(saleForm);

    setSaleForm({ productId: "", quantity: 1 });
  };

  return (
    <div className="vendas-container">
      <h3>Registrar Venda</h3>
      <form className="admin-form" onSubmit={handleSaleSubmit}>
        <select name="productId" value={saleForm.productId} onChange={handleSaleChange} required>
          <option value="">Selecione o produto</option>
          {products.filter(p => p.stock > 0).map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} (Estoque: {p.stock})
            </option>
          ))}
        </select>
        <input name="quantity" type="number" min="1" value={saleForm.quantity} onChange={handleSaleChange} required />
        <button type="submit">Registrar</button>
      </form>

      <h3>Histórico de Vendas</h3>
      {sales.length === 0 ? (
        <p>Nenhuma venda registrada.</p>
      ) : (
        <table className="sales-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Qtd</th>
              <th>Preço Unit.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{new Date(sale.timestamp).toLocaleString()}</td>
                <td>{sale.productName}</td>
                <td>{sale.category}</td>
                <td>{sale.quantity} {sale.unit}</td>
                <td>R$ {sale.price.toFixed(2).replace('.', ',')}</td>
                <td>R$ {sale.total.toFixed(2).replace('.', ',')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageSalesTab;