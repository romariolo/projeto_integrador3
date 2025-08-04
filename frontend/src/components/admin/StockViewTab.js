import React, { useState } from 'react';

function StockViewTab({ products, categories }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  return (
    <div className="estoque-container">
      <h3>Estoque por Categoria</h3>
      {categories.map((cat) => (
        <div key={cat.id}>
          <button
            className={`categoria-btn ${expandedCategory === cat.name ? "selected" : ""}`}
            onClick={() => setExpandedCategory(prev => prev === cat.name ? null : cat.name)}
          >
            {cat.name}
          </button>
          {expandedCategory === cat.name && (
            <div className="estoque-list">
              {products.filter(p => p.categoryId === cat.id).map((p) => (
                <div key={p.id} className="estoque-item">
                  <img src={`http://localhost:3000${p.imageUrl}`} alt={p.name} className="estoque-thumb" />
                  <div>
                    <p><strong>Produto:</strong> {p.name}</p>
                    <p><strong>Qtd:</strong> {p.stock} {p.unit}</p>
                    <p><strong>Preço:</strong> R$ {parseFloat(p.price).toFixed(2).replace('.', ',')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default StockViewTab;