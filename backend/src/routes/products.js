const express = require("express");

/**
 * Rotas de produtos.
 * GET /api/products       - Lista todos os produtos (com busca e filtro por categoria)
 * GET /api/products/:id   - Retorna um produto por ID
 */
function createProductRoutes(db) {
  const router = express.Router();

  /**
   * @swagger
   * /api/products:
   *   get:
   *     summary: Lista todos os produtos
   *     tags: [Produtos]
   *     parameters:
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Termo de busca por nome ou descrição
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *         description: Filtrar por categoria
   *     responses:
   *       200:
   *         description: Lista de produtos retornada com sucesso
   */
  router.get("/", (req, res) => {
    const { search, category } = req.query;

    let query = "SELECT * FROM products WHERE 1=1";
    const params = {};

    if (search) {
      query +=
        " AND (LOWER(name) LIKE LOWER(@search) OR LOWER(description) LIKE LOWER(@search))";
      params.search = `%${search}%`;
    }

    if (category) {
      query += " AND LOWER(category) = LOWER(@category)";
      params.category = category;
    }

    query += " ORDER BY id ASC";

    const products = db.prepare(query).all(params);
    res.json(products);
  });

  /**
   * @swagger
   * /api/products/{id}:
   *   get:
   *     summary: Retorna um produto por ID
   *     tags: [Produtos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID do produto
   *     responses:
   *       200:
   *         description: Produto encontrado
   *       404:
   *         description: Produto não encontrado
   */
  router.get("/:id", (req, res) => {
    const product = db
      .prepare("SELECT * FROM products WHERE id = ?")
      .get(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(product);
  });

  return router;
}

module.exports = { createProductRoutes };
