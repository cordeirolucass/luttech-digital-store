# 🛍️ Luttech Digital Store

E-commerce completo desenvolvido como projeto full-stack pela **Luttech**.

## 📋 Visão Geral

Aplicação full-stack de loja virtual com listagem de produtos, carrinho de compras e checkout simulado.

| Camada | Tecnologia |
|--------|-----------|
| Backend | Node.js + Express + SQLite |
| Frontend | React 18 + Vite |
| Documentação API | Swagger/OpenAPI |

## 🚀 Como Executar

### Pré-requisitos

- **Node.js** versão 18 ou superior
- **npm** (incluso com o Node.js)

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

O servidor será iniciado em **http://localhost:3001**.
A documentação Swagger estará disponível em **http://localhost:3001/api-docs**.

### 2. Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend será iniciado em **http://localhost:5173**.

> **Nota:** O Vite já está configurado com proxy para redirecionar chamadas `/api/*` ao backend na porta 3001. Não é necessária nenhuma configuração adicional de CORS.

## 🏗️ Arquitetura

### Backend

```
backend/
├── src/
│   ├── index.js              # Servidor Express (entry point)
│   ├── database.js            # Inicialização SQLite + seed
│   ├── swagger.js             # Configuração Swagger/OpenAPI
│   ├── routes/
│   │   ├── products.js        # GET /api/products
│   │   ├── cart.js            # CRUD /api/cart
│   │   └── checkout.js        # POST /api/checkout
│   └── middleware/
│       └── errorHandler.js    # Tratamento centralizado de erros
├── package.json
└── store.db                   # Banco SQLite (gerado automaticamente)
```

### Frontend

```
frontend/
├── src/
│   ├── main.jsx               # Entry point React
│   ├── App.jsx                # Componente raiz
│   ├── index.css              # Design system completo
│   ├── services/
│   │   └── api.js             # Camada de serviço HTTP
│   ├── context/
│   │   ├── CartContext.jsx    # Estado global do carrinho
│   │   └── ToastContext.jsx   # Sistema de notificações
│   ├── components/
│   │   ├── Header.jsx         # Cabeçalho com busca
│   │   ├── ProductCard.jsx    # Card de produto
│   │   ├── CartModal.jsx      # Painel do carrinho
│   │   ├── CartItem.jsx       # Item no carrinho
│   │   ├── QuantitySelector.jsx # Seletor de quantidade
│   │   ├── SuccessScreen.jsx  # Tela de sucesso
│   │   └── ToastContainer.jsx # Container de toasts
│   └── pages/
│       └── Home.jsx           # Página principal
├── index.html
├── vite.config.js
└── package.json
```

## 📡 API Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/products` | Lista produtos (query: `search`, `category`) |
| `GET` | `/api/products/:id` | Detalhe de um produto |
| `GET` | `/api/cart` | Retorna o carrinho |
| `POST` | `/api/cart` | Adiciona item `{ productId, quantity }` |
| `PUT` | `/api/cart/:productId` | Altera quantidade `{ quantity }` |
| `DELETE` | `/api/cart/:productId` | Remove item |
| `POST` | `/api/checkout` | Finaliza pedido (simulado) |

## ✅ Funcionalidades

- [x] Listagem de produtos com nome, descrição, preço e imagem
- [x] Carrinho: adicionar, remover, alterar quantidade
- [x] Validação de quantidade (mínimo 1, máximo 10)
- [x] Checkout simulado com mensagem de sucesso
- [x] Carrinho limpo após checkout
- [x] Busca de produtos por nome/descrição
- [x] Filtros por categoria
- [x] Toasts de feedback ("Produto adicionado com sucesso")
- [x] Componentização e reusabilidade de UI
- [x] Documentação Swagger detalhada
- [x] Organização de pastas seguindo boas práticas
- [x] Layout responsivo
- [x] Animações e transições suaves
- [x] Mensagens de erro amigáveis
- [x] HTML semântico com ARIA labels

## 🎨 Decisões de Design

1. **Dark theme** com gradientes sutis (roxo + ciano) para visual moderno e premium
2. **Carrinho como slide panel** ao invés de página separada — UX mais fluida
3. **Context API** ao invés de Redux — complexidade adequada ao tamanho do projeto
4. **CSS vanilla com custom properties** — controle total sem dependências extras
5. **better-sqlite3** (síncrono) ao invés do sqlite3 (async) — mais simples e performático para este caso de uso
6. **Transações SQLite** no checkout — garante atomicidade ao criar pedido e limpar carrinho

## 📝 Premissas

- Não há autenticação de usuários — carrinho único compartilhado
- Checkout é simulado — sem processamento real de pagamento
- Imagens dos produtos são URLs externas (Unsplash)
- O banco SQLite é criado e populado automaticamente na primeira execução
