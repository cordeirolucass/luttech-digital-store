const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Luttech Digital Store API",
      version: "1.0.0",
      description:
        "API de e-commerce da Luttech Digital Store. Permite gerenciar produtos, carrinho de compras e checkout.",
      contact: {
        name: "Desenvolvedor",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Servidor de desenvolvimento",
      },
    ],
    tags: [
      { name: "Produtos", description: "Operações relacionadas a produtos" },
      { name: "Carrinho", description: "Gerenciamento do carrinho de compras" },
      { name: "Checkout", description: "Finalização de pedidos" },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec };
