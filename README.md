# Meu Sertão Marketplace - Marketplace de Comércio Local

Um marketplace digital focado na comercialização de produtos locais da região dos Sertões de Crateús.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React** - Interface de usuário
- **Material-UI (MUI)** - Componentes e design system
- **React Router** - Navegação entre páginas
- **Context API** - Gerenciamento de estado global

### Backend
- **Node.js** com **Express** - Servidor e API REST
- **Sequelize** - ORM para banco de dados
- **MySQL/PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação e autorização
- **Multer** - Upload de imagens

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js (versão 14 ou superior)
- MySQL ou PostgreSQL
- npm ou yarn

### 1. Clonar o Repositório
```bash
git clone https://github.com/romariolo/projeto_integrador3.git
cd sertao-livre
```

### 2. Configurar o Backend
```bash
cd backend
npm install

# Configurar arquivo .env
cp .env.example .env
```

Configure o arquivo `.env`:
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sertao_livre
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
JWT_SECRET=sua_chave_secreta_jwt
```

```bash
npm start
```

### 3. Configurar o Frontend
```bash
cd frontend
npm install
npm start
```

## 🔄 Fluxos de Interação dos Usuários

### 🛒 Fluxo de Compra (Comprador)
**Login → Vitrine → Escolher Produto → Comprar → Inserir Informações → Finalizar Compra → Acompanhar Pedido**

### 🏪 Fluxo de Venda (Vendedor)
**Login → Painel Vendedor → Cadastrar Produto → Gerenciar Estoque → Visualizar Pedidos → Atualizar Status**

### ⚙️ Fluxo de Administração (Admin)
**Login Admin → Painel Administrativo → Gerenciar Usuários/Produtos → Visualizar Relatórios → Controlar Sistema**

## 👥 Perfis de Usuário

### 🛒 **Comprador**
- Acesso livre mediante cadastro
- Navegação e compra de produtos
- Acompanhamento de pedidos

### 🏪 **Vendedor** 
- Cadastro especial escolhendo "Vender"
- Todas as funcionalidades de comprador
- Gerenciamento de produtos e estoque
- Painel de pedidos recebidos

### ⚙️ **Administrador**
- **Login:** `admin@example.com`
- **Senha:** `senhaadmin123`
- Controle total do sistema
- Gerenciamento de usuários e relatórios

## 🛒 Como Comprar

### 1. Acessar e Cadastrar
- Acesse o marketplace
- Clique em "Cadastrar" se não tiver conta
- Faça login com suas credenciais

### 2. Buscar Produtos
- Navegue pela vitrine na página inicial
- Use a barra de busca para encontrar produtos específicos
- Visualize detalhes clicando no produto

### 3. Realizar Compra
- Clique em "Adicionar ao Carrinho"
- Acesse o carrinho pelo ícone no topo
- Revise os itens e clique em "Finalizar Compra"
- Preencha dados de entrega e pagamento
- Confirme o pedido

### 4. Acompanhar Pedido
- Acesse "Meus Pedidos" no menu
- Visualize status e detalhes dos pedidos

## 🏪 Como Vender

### 1. Cadastrar como Vendedor
- Na tela de cadastro, selecione "Quero Vender"
- Complete o registro com dados de vendedor
- Faça login normalmente

### 2. Acessar Painel do Vendedor
- Após login, clique em "Painel Vendedor"
- Visualize dashboard com resumo de vendas

### 3. Cadastrar Produtos
- No painel, clique "Adicionar Produto"
- Preencha informações:
  - Nome do produto
  - Descrição detalhada
  - Preço de venda
  - Quantidade em estoque
  - Categoria
- Faça upload da imagem do produto
- Clique "Salvar Produto"

### 4. Gerenciar Vendas
- Visualize pedidos recebidos na aba "Pedidos"
- Atualize status de entrega conforme necessário
- Monitore estoque e reponha produtos quando necessário

## ⚙️ Painel Administrativo

### 1. Acessar como Admin
- Faça login com credenciais de administrador
- Acesse `/admin` na URL ou menu "Administração"

### 2. Gerenciar Usuários
- Visualize lista completa de usuários
- Altere permissões e status de contas
- Monitore atividade de vendedores

### 3. Controlar Produtos
- Visualize todos os produtos do marketplace
- Edite ou remova produtos quando necessário
- Gerencie categorias de produtos

## 📱 Navegação do Sistema

### Menu Principal
- **Home**: Vitrine de produtos
- **Produtos**: Catálogo completo
- **Carrinho**: Itens selecionados
- **Meus Pedidos**: Histórico de compras (comprador)
- **Painel Vendedor**: Gestão de vendas (vendedor)
- **Administração**: Controle geral (admin)

### Ações Rápidas
- **Busca**: Barra no topo para encontrar produtos
- **Perfil**: Gerenciar dados pessoais
- **Logout**: Sair do sistema
- **Suporte**: Contato para ajuda

## 🔧 Configuração Inicial do Sistema

### Arquivo .env (Backend)
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sertao_livre
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
JWT_SECRET=sua_chave_secreta_jwt
```

### Primeiro Acesso
1. Configure o banco de dados
2. Execute as migrações automáticas
3. Use as credenciais de admin para primeiro acesso
4. Configure categorias básicas de produtos
5. Faça cadastro de teste como vendedor
6. Adicione produtos de exemplo

---

**Sistema desenvolvido para fomentar o comércio local dos Sertões de Crateús**
