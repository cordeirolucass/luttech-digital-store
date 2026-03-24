Como Funciona o Backend da Luttech Store
Visão Geral: O que é Backend e Frontend?
Imagine um restaurante:

O frontend é o salão — o que o cliente vê: o cardápio bonito, as mesas, a decoração. É a interface visual.
O backend é a cozinha — onde os pedidos são processados, os pratos são preparados e os dados são armazenados. O cliente nunca vê a cozinha, mas sem ela nada funciona.
No nosso sistema:

Frontend (pasta frontend/) → React + Vite → o que aparece no navegador na porta 5173
Backend (pasta backend/) → Node.js + Express → o servidor que roda na porta 3001
📡 O que é uma API?
API = Application Programming Interface (Interface de Programação de Aplicações).

É um conjunto de "endereços" (URLs) que o frontend pode acessar para pedir ou enviar dados ao backend. Pense na API como o garçom do restaurante: o frontend (cliente) faz um pedido ao garçom (API), que leva o pedido para a cozinha (backend), e depois traz a resposta de volta.

Exemplo concreto no nosso sistema:
Quando você abre o site e vê os produtos, o que acontece nos bastidores é:

1. O navegador (frontend) faz uma requisição: "Me dê todos os produtos"
   → GET http://localhost:3001/api/products
2. O backend recebe esse pedido, vai ao banco de dados SQLite, busca todos os produtos
3. O backend responde com os dados em formato JSON:
   [
     { "id": 1, "name": "Camiseta Dev", "price": 79.9, ... },
     { "id": 2, "name": "Caneca Programador", "price": 39.9, ... },
     ...
   ]
4. O frontend recebe esses dados e renderiza os cards bonitos na tela
🔧 Métodos HTTP (GET, POST, PUT, DELETE)
Os métodos HTTP são como verbos que indicam o que você quer fazer com um recurso. São inspirados nas operações básicas de qualquer sistema (CRUD):

Método HTTP	Significado	Analogia	Exemplo no nosso sistema
GET	Ler/Buscar dados	"Me mostra o cardápio"	Listar produtos, ver carrinho
POST	Criar algo novo	"Quero fazer um novo pedido"	Adicionar item ao carrinho, fazer checkout
PUT	Atualizar algo existente	"Troca o prato do meu pedido"	Alterar quantidade de um item no carrinho
DELETE	Remover algo	"Cancela esse item do meu pedido"	Remover item do carrinho
Como ficam no nosso sistema:
GET    /api/products          → "Me dê a lista de todos os produtos"
GET    /api/products/3        → "Me dê os detalhes do produto com ID=3"
GET    /api/cart              → "Me mostra o que tem no carrinho"
POST   /api/cart              → "Adiciona o produto X ao carrinho"
PUT    /api/cart/3            → "Muda a quantidade do produto 3 no carrinho"
DELETE /api/cart/3            → "Remove o produto 3 do carrinho"
POST   /api/checkout          → "Finaliza a compra"
💾 O que é o SQLite?
SQLite é um banco de dados — um lugar para armazenar dados de forma organizada e persistente (ou seja, os dados continuam lá mesmo se você desligar o servidor).

Por que SQLite e não outro banco?
Característica	SQLite	MySQL/PostgreSQL
Instalação	Nenhuma (é um arquivo!)	Precisa instalar servidor separado
Arquivo	
store.db
 (um único arquivo)	Servidor rodando em background
Complexidade	Simples, ideal para projetos pequenos	Mais complexo, ideal para produção
Performance	Ótima para leitura	Melhor para muitas escritas simultâneas
No nosso caso, o banco de dados é o arquivo 
backend/store.db
. Dentro dele temos tabelas (como planilhas do Excel):

┌─────────────────────────────────────────────────────┐
│  TABELA: products (os produtos da loja)             │
├─────┬───────────────────┬────────┬──────────────────┤
│ id  │ name              │ price  │ category         │
├─────┼───────────────────┼────────┼──────────────────┤
│ 1   │ Camiseta Dev      │ 79.90  │ roupas           │
│ 2   │ Caneca Programador│ 39.90  │ acessórios       │
│ 3   │ Mouse Pad Gamer XL│ 89.90  │ periféricos      │
│ ... │ ...               │ ...    │ ...              │
└─────┴───────────────────┴────────┴──────────────────┘
┌─────────────────────────────────────────┐
│  TABELA: cart_items (itens no carrinho) │
├─────┬────────────┬──────────────────────┤
│ id  │ product_id │ quantity             │
├─────┼────────────┼──────────────────────┤
│ 1   │ 3          │ 2   (2x Mouse Pad)   │
│ 2   │ 7          │ 1   (1x Hub USB-C)   │
└─────┴────────────┴──────────────────────┘
┌─────────────────────────────────────────┐
│  TABELA: orders (pedidos finalizados)   │
├─────┬────────┬───────────┬──────────────┤
│ id  │ total  │ status    │ created_at   │
├─────┼────────┼───────────┼──────────────┤
│ 1   │ 259.70 │ completed │ 2026-03-22   │
└─────┴────────┴───────────┴──────────────┘
┌──────────────────────────────────────────────────┐
│  TABELA: order_items (itens de cada pedido)      │
├─────┬──────────┬────────────┬──────────┬─────────┤
│ id  │ order_id │ product_id │ quantity │ price   │
├─────┼──────────┼────────────┼──────────┼─────────┤
│ 1   │ 1        │ 3          │ 2        │ 89.90   │
│ 2   │ 1        │ 7          │ 1        │ 179.90  │
└─────┴──────────┴────────────┴──────────┴─────────┘
📁 Explicação Arquivo por Arquivo
Estrutura do Backend
backend/
├── package.json            ← 1. Configuração do projeto
├── store.db                ← Banco de dados (gerado automaticamente)
└── src/
    ├── index.js            ← 2. Ponto de entrada (servidor principal)
    ├── database.js         ← 3. Configuração do banco de dados
    ├── swagger.js          ← 4. Documentação da API
    ├── routes/
    │   ├── products.js     ← 5. Rotas de produtos
    │   ├── cart.js         ← 6. Rotas do carrinho
    │   └── checkout.js     ← 7. Rota de checkout
    └── middleware/
        └── errorHandler.js ← 8. Tratamento de erros
1. 
package.json
 — A "certidão de nascimento" do projeto
json
{
  "name": "luttech-digital-store-backend",
  "scripts": {
    "start": "node src/index.js",       // roda o servidor normalmente
    "dev": "node --watch src/index.js"  // roda COM auto-reload (reinicia ao salvar)
  },
  "dependencies": {
    "better-sqlite3": "^11.7.0",     // driver para conectar ao SQLite
    "cors": "^2.8.5",               // permite o frontend acessar o backend
    "express": "^4.21.0",           // framework web (cria o servidor HTTP)
    "swagger-jsdoc": "^6.2.8",      // gera documentação da API
    "swagger-ui-express": "^5.0.1"  // mostra a documentação em uma página web
  }
}
O que cada dependência faz:

Pacote	Para que serve
express	O framework principal. Cria o servidor web e gerencia as rotas (URLs)
better-sqlite3	Permite ler/escrever no banco SQLite direto do JavaScript
cors	Permite que o frontend (porta 5173) faça requisições ao backend (porta 3001)
swagger-jsdoc + swagger-ui-express	Gera uma documentação interativa da API
2. 
src/index.js
 — O Coração do Backend
Este é o ponto de entrada — o primeiro arquivo que roda quando você faz npm run dev.

javascript
// 1. IMPORTAÇÕES — carrega tudo que vai precisar
const express = require("express");       // Framework web
const cors = require("cors");             // Libera acesso cross-origin
const { initDatabase } = require("./database");  // Função para iniciar o BD
const { createProductRoutes } = require("./routes/products");  // Rotas
const { createCartRoutes } = require("./routes/cart");
const { createCheckoutRoutes } = require("./routes/checkout");
const { errorHandler } = require("./middleware/errorHandler");
// 2. INICIALIZA O BANCO DE DADOS
const db = initDatabase();  // Cria tabelas + insere produtos se vazio
// 3. CRIA A APLICAÇÃO EXPRESS
const app = express();
// 4. MIDDLEWARES GLOBAIS (rodam em TODA requisição)
app.use(cors());           // Permite requisições de outros domínios
app.use(express.json());   // Permite receber dados JSON no body da requisição
// 5. REGISTRA AS ROTAS
app.use("/api/products", createProductRoutes(db));   // /api/products → products.js
app.use("/api/cart", createCartRoutes(db));           // /api/cart → cart.js
app.use("/api/checkout", createCheckoutRoutes(db));   // /api/checkout → checkout.js
// 6. MIDDLEWARE DE ERROS (pega qualquer erro não tratado)
app.use(errorHandler);
// 7. LIGA O SERVIDOR
app.listen(3001, () => {
  console.log("🚀 Servidor rodando em http://localhost:3001");
});
Conceito importante: Middleware

Middleware é uma função que fica no "meio do caminho" entre a requisição do cliente e a resposta do servidor. É como uma fila de inspeção:

Requisição → [cors] → [express.json] → [rota] → Resposta
                ↑           ↑              ↑
            "Pode passar"  "Converte o    "Processa
             de outro       corpo para     e envia
             domínio"       JavaScript"     dados"
3. 
src/database.js
 — O Banco de Dados
Este arquivo faz duas coisas:

Cria as tabelas no banco SQLite (se não existirem)
Insere os produtos iniciais (seed) se a tabela estiver vazia
javascript
function initDatabase() {
  // Abre (ou cria) o arquivo store.db
  const db = new Database("store.db");
  // Cria 4 tabelas usando SQL
  db.exec(`
    -- Tabela de produtos (os itens da loja)
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID único, cresce automaticamente
      name TEXT NOT NULL,                     -- Nome (obrigatório)
      description TEXT NOT NULL,              -- Descrição (obrigatória)
      price REAL NOT NULL,                    -- Preço (número decimal)
      image TEXT,                             -- URL da imagem
      category TEXT DEFAULT 'geral'           -- Categoria (padrão: 'geral')
    );
    -- Tabela do carrinho (itens que o usuário quer comprar)
    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL UNIQUE,    -- Cada produto aparece só 1x
      quantity INTEGER NOT NULL DEFAULT 1    -- De 1 a 10 unidades
        CHECK(quantity >= 1 AND quantity <= 10),
      FOREIGN KEY (product_id) REFERENCES products(id)
      -- ↑ "product_id deve existir na tabela products"
    );
    -- Tabela de pedidos finalizados
    CREATE TABLE IF NOT EXISTS orders (...);
    -- Tabela de itens de cada pedido
    CREATE TABLE IF NOT EXISTS order_items (...);
  `);
  // Se não tem nenhum produto, insere 12 produtos iniciais
  const count = db.prepare("SELECT COUNT(*) as count FROM products").get();
  if (count.count === 0) {
    seedProducts(db);  // Insere Camiseta Dev, Caneca, Mouse Pad, etc.
  }
  return db;
}
IMPORTANT

A cláusula FOREIGN KEY (product_id) REFERENCES products(id) cria um relacionamento entre tabelas. Isso garante que você só pode adicionar ao carrinho um product_id que realmente existe na tabela products. Se tentasse adicionar product_id = 999 e esse produto não existisse, o banco daria erro.

4. 
src/swagger.js
 — Documentação da API
Gera uma página interativa onde você pode ver e testar todos os endpoints da API. Acesse http://localhost:3001/api-docs para ver.

javascript
const options = {
  definition: {
    openapi: "3.0.0",                // Versão do padrão OpenAPI
    info: {
      title: "Luttech Digital Store API", // Título da documentação
      version: "1.0.0",
    },
    tags: [
      { name: "Produtos" },
      { name: "Carrinho" },
      { name: "Checkout" },
    ],
  },
  apis: ["./src/routes/*.js"],  // Lê os comentários @swagger dos arquivos de rota
};
Os comentários @swagger que você vê nos arquivos de rotas (aqueles blocos de comentários grandes) são lidos por esse módulo para gerar a documentação automaticamente.

5. 
src/routes/products.js
 — Rotas de Produtos
Define os endpoints para consultar produtos. Só usa GET porque o frontend não precisa criar/editar/deletar produtos.

GET /api/products — Listar todos os produtos
javascript
router.get("/", (req, res) => {
  // req.query contém os parâmetros da URL
  // Ex: /api/products?search=camiseta&category=roupas
  //     → req.query = { search: "camiseta", category: "roupas" }
  const { search, category } = req.query;
  // Monta a query SQL dinamicamente
  let query = "SELECT * FROM products WHERE 1=1";
  if (search) {
    // Busca no nome OU na descrição (case-insensitive)
    query += " AND (LOWER(name) LIKE LOWER(@search) ...)";
  }
  if (category) {
    query += " AND LOWER(category) = LOWER(@category)";
  }
  // Executa a query e retorna os resultados
  const products = db.prepare(query).all(params);
  res.json(products);  // Envia como JSON para o frontend
});
NOTE

O WHERE 1=1 é um truque comum. Como é sempre verdadeiro, permite adicionar condições com AND sem se preocupar se é a primeira condição ou não.

GET /api/products/:id — Buscar um produto específico
javascript
router.get("/:id", (req, res) => {
  // ":id" é um parâmetro dinâmico da URL
  // Ex: /api/products/5 → req.params.id = "5"
  const product = db
    .prepare("SELECT * FROM products WHERE id = ?")
    .get(req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Produto não encontrado" });
    //                    ↑ 
    // 404 = "Not Found" (não encontrado)
  }
  res.json(product);
});
6. 
src/routes/cart.js
 — Rotas do Carrinho (o mais complexo!)
Este arquivo implementa o CRUD completo do carrinho:

GET /api/cart — Ver o carrinho
javascript
router.get("/", (req, res) => {
  // Faz um JOIN entre cart_items e products
  // Isso "junta" as duas tabelas para pegar o nome, preço e imagem
  // do produto junto com a quantidade no carrinho
  const items = db.prepare(`
    SELECT 
      ci.quantity,          -- Quantas unidades
      p.name,               -- Nome do produto
      p.price,              -- Preço unitário
      p.image,              -- Imagem
      ROUND(p.price * ci.quantity, 2) AS subtotal  -- Preço × quantidade
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
  `).all();
  // Calcula o total
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  // Retorna tudo organizado
  res.json({ items, total, itemCount: ... });
});
POST /api/cart — Adicionar ao carrinho
javascript
router.post("/", (req, res) => {
  // req.body contém os dados enviados pelo frontend
  // Ex: { productId: 3, quantity: 1 }
  const { productId, quantity = 1 } = req.body;
  // 1. Valida os dados
  if (!productId) return res.status(400).json({ error: "..." });
  //                                   ↑
  // 400 = "Bad Request" (requisição inválida)
  // 2. Verifica se o produto existe
  const product = db.prepare("SELECT id FROM products WHERE id = ?").get(productId);
  if (!product) return res.status(404).json({ error: "Produto não encontrado" });
  // 3. Se já está no carrinho, incrementa a quantidade
  const existingItem = db.prepare("SELECT * FROM cart_items WHERE product_id = ?").get(productId);
  if (existingItem) {
    // Já tem no carrinho → atualiza quantidade
    db.prepare("UPDATE cart_items SET quantity = ? WHERE product_id = ?")
      .run(newQuantity, productId);
    return res.status(200).json({ message: "Quantidade atualizada" });
  }
  // 4. Se não está no carrinho, insere novo item
  db.prepare("INSERT INTO cart_items (product_id, quantity) VALUES (?, ?)")
    .run(productId, quantity);
  res.status(201).json({ message: "Produto adicionado ao carrinho" });
  //         ↑
  // 201 = "Created" (algo novo foi criado)
});
PUT /api/cart/:productId — Alterar quantidade
javascript
router.put("/:productId", (req, res) => {
  // Ex: PUT /api/cart/3 com body { quantity: 5 }
  // → "Mude a quantidade do produto 3 para 5"
  const productId = parseInt(req.params.productId);
  const { quantity } = req.body;
  // Valida e atualiza no banco
  db.prepare("UPDATE cart_items SET quantity = ? WHERE product_id = ?")
    .run(quantity, productId);
  res.json({ message: "Quantidade atualizada" });
});
DELETE /api/cart/:productId — Remover do carrinho
javascript
router.delete("/:productId", (req, res) => {
  // Ex: DELETE /api/cart/3 → "Remove o produto 3 do carrinho"
  const result = db
    .prepare("DELETE FROM cart_items WHERE product_id = ?")
    .run(productId);
  if (result.changes === 0) {
    // changes = quantas linhas foram afetadas. Se 0, não encontrou nada.
    return res.status(404).json({ error: "Item não encontrado" });
  }
  res.json({ message: "Item removido do carrinho" });
});
7. 
src/routes/checkout.js
 — Finalizar Compra
javascript
router.post("/", (req, res) => {
  // 1. Busca tudo que está no carrinho
  const cartItems = db.prepare(`
    SELECT ci.product_id, ci.quantity, p.price, p.name
    FROM cart_items ci JOIN products p ON ci.product_id = p.id
  `).all();
  // 2. Se o carrinho está vazio, rejeita
  if (cartItems.length === 0) {
    return res.status(400).json({ error: "Carrinho está vazio" });
  }
  // 3. Calcula o total
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // 4. TRANSAÇÃO — executa tudo de uma vez (ou tudo funciona, ou nada funciona)
  const processCheckout = db.transaction(() => {
    // Cria o pedido
    const orderResult = db.prepare("INSERT INTO orders (total) VALUES (?)").run(total);
    const orderId = orderResult.lastInsertRowid;
    // Salva cada item do pedido
    for (const item of cartItems) {
      db.prepare("INSERT INTO order_items (...) VALUES (...)").run(...);
    }
    // Limpa o carrinho
    db.prepare("DELETE FROM cart_items").run();
    return orderId;
  });
  const orderId = processCheckout();  // Executa a transação
  // 5. Retorna confirmação
  res.json({
    message: "Pedido finalizado com sucesso! 🎉",
    order: { id: orderId, total, items: cartItems }
  });
});
WARNING

A transação (db.transaction(...)) é fundamental aqui. Imagine que o sistema cria o pedido mas dá erro ao limpar o carrinho — você ficaria com itens duplicados! A transação garante que: se qualquer passo falhar, todos os passos são desfeitos. É tudo ou nada.

8. 
src/middleware/errorHandler.js
 — Tratamento de Erros
É a "rede de segurança" — captura qualquer erro que não foi tratado nas rotas.

javascript
function errorHandler(err, req, res, _next) {
  console.error("❌ Erro:", err.message);
  // Erros específicos do SQLite (ex: tentar inserir dado duplicado)
  if (err.code === "SQLITE_CONSTRAINT") {
    return res.status(409).json({ error: "Conflito de dados" });
    //                   ↑
    // 409 = "Conflict" (conflito)
  }
  // Erro genérico
  res.status(500).json({ error: "Erro interno do servidor" });
  //         ↑
  // 500 = "Internal Server Error" (erro do servidor)
});
🔗 Como Frontend e Backend se Conectam
O Vite (frontend) tem um proxy configurado no 
vite.config.js
:

javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',  // Redireciona para o backend
    },
  },
}
Isso significa que quando o frontend faz 
fetch('/api/products')
:

O navegador envia para localhost:5173/api/products (o frontend)
O Vite intercepta e redireciona para localhost:3001/api/products (o backend)
O backend processa e retorna os dados
O Vite repassa a resposta ao navegador
Isso evita problemas de CORS (restrições de segurança do navegador).

🗺️ Fluxo Completo: O que acontece quando o usuário clica "Adicionar ao Carrinho"
USUÁRIO                    FRONTEND (React)              BACKEND (Express)           BANCO (SQLite)
    │                            │                              │                          │
    │ Clica "🛒 Adicionar"      │                              │                          │
    │ ──────────────────────────>│                              │                          │
    │                            │ fetch('/api/cart', {         │                          │
    │                            │   method: 'POST',           │                          │
    │                            │   body: {productId: 3}      │                          │
    │                            │ }) ─────────────────────────>│                          │
    │                            │                              │ SELECT id FROM products  │
    │                            │                              │ WHERE id = 3             │
    │                            │                              │ ────────────────────────>│
    │                            │                              │ <──── { id: 3 } (existe) │
    │                            │                              │                          │
    │                            │                              │ INSERT INTO cart_items    │
    │                            │                              │ (product_id, quantity)    │
    │                            │                              │ VALUES (3, 1)            │
    │                            │                              │ ────────────────────────>│
    │                            │                              │ <──── OK                 │
    │                            │                              │                          │
    │                            │ <─── { message: "Adicionado"}│                          │
    │                            │                              │                          │
    │ Vê toast "Adicionado!"    │                              │                          │
    │ <──────────────────────────│                              │                          │
📊 Resumo dos Códigos de Status HTTP
Código	Significado	Quando aparece no nosso sistema
200	OK ✅	Requisição funcionou normalmente
201	Created ✨	Algo novo foi criado (item no carrinho)
400	Bad Request ❌	Dados inválidos (ex: quantidade negativa)
404	Not Found 🔍	Recurso não encontrado (ex: produto inexistente)
409	Conflict ⚠️	Conflito de dados no banco
500	Internal Error 💥	Erro inesperado no servidor
🧠 Como pensar na hora de modelar um sistema como esse?
Passo 1: Defina as entidades (tabelas)
Pergunte: "Que dados eu preciso guardar?"

Produtos → tabela products
Carrinho → tabela cart_items
Pedidos → tabelas orders + order_items
Passo 2: Defina os relacionamentos entre elas
Um carrinho TEM itens, cada item REFERENCIA um produto
Um pedido TEM itens, cada item REFERENCIA um produto
Passo 3: Defina as operações (endpoints da API)
Pergunte: "O que o usuário precisa fazer?"

Ver produtos → GET /api/products
Adicionar ao carrinho → POST /api/cart
Remover do carrinho → DELETE /api/cart/:id
Finalizar compra → POST /api/checkout
Passo 4: Implemente com validações
Sempre valide os dados antes de processar:

O produto existe?
A quantidade está no intervalo permitido?
O carrinho tem itens antes do checkout?