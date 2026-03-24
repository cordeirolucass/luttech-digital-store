const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const { initDatabase } = require("./database");
const { createProductRoutes } = require("./routes/products");
const { createCartRoutes } = require("./routes/cart");
const { createCheckoutRoutes } = require("./routes/checkout");
const { errorHandler } = require("./middleware/errorHandler");
const { swaggerSpec } = require("./swagger");

const PORT = process.env.PORT || 3001;

// Inicializar banco de dados
const db = initDatabase();

// Criar aplicação Express
const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas da API
app.use("/api/products", createProductRoutes(db));
app.use("/api/cart", createCartRoutes(db));
app.use("/api/checkout", createCheckoutRoutes(db));

// Rota raiz
app.get("/", (req, res) => {
  res.json({
    message: "🛒 Luttech Digital Store API",
    version: "1.0.0",
    docs: `http://localhost:${PORT}/api-docs`,
    endpoints: {
      products: "/api/products",
      cart: "/api/cart",
      checkout: "/api/checkout",
    },
  });
});

// Middleware de tratamento de erros
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📚 Documentação Swagger em http://localhost:${PORT}/api-docs\n`);
});

// Fechar o banco de dados ao encerrar o processo
process.on("SIGINT", () => {
  db.close();
  process.exit(0);
});
