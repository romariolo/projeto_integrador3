import React, { useState } from "react";

function ProductForm({ categories, onProductSubmit }) {
  const [form, setForm] = useState({ name: "", price: "", unit: "", image: "", stock: 0, categoryId: "" });
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.unit || !form.categoryId) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }
    onProductSubmit(form);
    setForm({ name: "", price: "", unit: "", image: "", stock: 0, categoryId: "" });
    setImagePreview(null);
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <input name="name" placeholder="Nome do produto" value={form.name} onChange={handleChange} />
      <input name="price" type="number" step="0.01" placeholder="Preço" value={form.price} onChange={handleChange} />
      <input name="unit" placeholder="Unidade (kg, litro...)" value={form.unit} onChange={handleChange} />
      <input name="stock" type="number" placeholder="Estoque" value={form.stock} onChange={handleChange} />
      <select name="categoryId" value={form.categoryId} onChange={handleChange}>
        <option value="">Selecione a categoria</option>
        {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
      </select>
      <label className="image-upload-label">
        Escolher Imagem
        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
      </label>
      {imagePreview && <img src={imagePreview} alt="preview" className="image-preview" />}
      <button type="submit">Cadastrar Produto</button>
    </form>
  );
}

function CategoryManager({ categories, onCategorySubmit }) {
    const [categoryName, setCategoryName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!categoryName.trim()) return;
        onCategorySubmit(categoryName);
        setCategoryName("");
    }
    
    return (
        <div className="categorias-container">
          <form className="admin-form" onSubmit={handleSubmit}>
            <input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Nova categoria" />
            <button type="submit">Adicionar</button>
          </form>
          {/* A lógica de listar, editar e deletar categorias ficaria aqui */}
        </div>
    );
}


function ManageProductsTab({ categories, onProductSubmit, onCategorySubmit }) {
  const [productTab, setProductTab] = useState("cadastro");

  return (
    <>
      <div className="product-tabs">
        <button className={`tab-button ${productTab === "cadastro" ? "active" : ""}`} onClick={() => setProductTab("cadastro")}>Cadastro de Produtos</button>
        <button className={`tab-button ${productTab === "categorias" ? "active" : ""}`} onClick={() => setProductTab("categorias")}>Cadastro de Categorias</button>
      </div>

      {productTab === "cadastro" ? (
        <ProductForm categories={categories} onProductSubmit={onProductSubmit} />
      ) : (
        <CategoryManager categories={categories} onCategorySubmit={onCategorySubmit} />
      )}
    </>
  );
}

export default ManageProductsTab;