const express = require("express");

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 10;

/**
 * Rotas do carrinho de compras.
 * GET    /api/cart              - Retorna os itens do carrinho
 * POST   /api/cart              - Adiciona item ao carrinho
 * PUT    /api/cart/:productId   - Altera quantidade de um item
 * DELETE /api/cart/:productId   - Remove item do carrinho
 */
function createCartRoutes(db) {
  const router = express.Router();

  /**
   * @swagger
   * /api/cart:
   *   get:
   *     summary: Retorna os itens do carrinho com informações do produto
   *     tags: [Carrinho]
   *     responses:
   *       200:
   *         description: Itens do carrinho retornados com sucesso
   */
  router.get("/", (req, res) => {
    const items = db.prepare
      (
        `SELECT 
          ci.id,
          ci.product_id AS productId,
          ci.quantity,
          p.name,
          p.description,
          p.price,
          p.image,
          p.category,
          ROUND(p.price * ci.quantity, 2) AS subtotal
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        ORDER BY ci.id ASC`
      )
      .all();

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    res.json({
      items,
      total: Math.round(total * 100) / 100,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    });
  });

  /**
   * @swagger
   * /api/cart:
   *   post:
   *     summary: Adiciona um produto ao carrinho
   *     tags: [Carrinho]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - productId
   *             properties:
   *               productId:
   *                 type: integer
   *                 description: ID do produto
   *               quantity:
   *                 type: integer
   *                 minimum: 1
   *                 maximum: 10
   *                 default: 1
   *                 description: Quantidade (1-10)
   *     responses:
   *       201:
   *         description: Item adicionado ao carrinho
   *       400:
   *         description: Dados inválidos
   *       404:
   *         description: Produto não encontrado
   */
  router.post("/", (req, res) => {
    const { productId, quantity = 1 } = req.body;

    // Validação do productId
    if (!productId || !Number.isInteger(productId)) {
      return res
        .status(400)
        .json({ error: "productId é obrigatório e deve ser um número inteiro" });
    }

    // Validação da quantidade
    if (!Number.isInteger(quantity) || quantity < MIN_QUANTITY || quantity > MAX_QUANTITY) {
      return res.status(400).json({
        error: `Quantidade deve ser um número inteiro entre ${MIN_QUANTITY} e ${MAX_QUANTITY}`,
      });
    }

    // Verifica se o produto existe
    const product = db
      .prepare("SELECT id FROM products WHERE id = ?")
      .get(productId);
    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    // Verifica se já está no carrinho
    const existingItem = db
      .prepare("SELECT * FROM cart_items WHERE product_id = ?")
      .get(productId);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > MAX_QUANTITY) {
        return res.status(400).json({
          error: `Quantidade máxima por produto é ${MAX_QUANTITY}. Você já tem ${existingItem.quantity} no carrinho.`,
        });
      }
      db.prepare("UPDATE cart_items SET quantity = ? WHERE product_id = ?").run(
        newQuantity,
        productId
      );
      return res.status(200).json({ message: "Quantidade atualizada no carrinho", quantity: newQuantity });
    }

    db.prepare("INSERT INTO cart_items (product_id, quantity) VALUES (?, ?)").run(
      productId,
      quantity
    );

    res.status(201).json({ message: "Produto adicionado ao carrinho" });
  });

  /**
   * @swagger
   * /api/cart/{productId}:
   *   put:
   *     summary: Altera a quantidade de um item no carrinho
   *     tags: [Carrinho]
   *     parameters:
   *       - in: path
   *         name: productId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID do produto
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - quantity
   *             properties:
   *               quantity:
   *                 type: integer
   *                 minimum: 1
   *                 maximum: 10
   *                 description: Nova quantidade (1-10)
   *     responses:
   *       200:
   *         description: Quantidade atualizada
   *       400:
   *         description: Quantidade inválida
   *       404:
   *         description: Item não encontrado no carrinho
   */
  router.put("/:productId", (req, res) => {
    const productId = parseInt(req.params.productId, 10);
    const { quantity } = req.body;

    // Validação da quantidade
    if (!Number.isInteger(quantity) || quantity < MIN_QUANTITY || quantity > MAX_QUANTITY) {
      return res.status(400).json({
        error: `Quantidade deve ser um número inteiro entre ${MIN_QUANTITY} e ${MAX_QUANTITY}`,
      });
    }

    // Verifica se o item está no carrinho
    const item = db
      .prepare("SELECT * FROM cart_items WHERE product_id = ?")
      .get(productId);
    if (!item) {
      return res.status(404).json({ error: "Item não encontrado no carrinho" });
    }

    db.prepare("UPDATE cart_items SET quantity = ? WHERE product_id = ?").run(
      quantity,
      productId
    );

    res.json({ message: "Quantidade atualizada", quantity });
  });

  /**
   * @swagger
   * /api/cart/{productId}:
   *   delete:
   *     summary: Remove um item do carrinho
   *     tags: [Carrinho]
   *     parameters:
   *       - in: path
   *         name: productId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID do produto
   *     responses:
   *       200:
   *         description: Item removido do carrinho
   *       404:
   *         description: Item não encontrado no carrinho
   */
  router.delete("/:productId", (req, res) => {
    const productId = parseInt(req.params.productId, 10);

    const result = db
      .prepare("DELETE FROM cart_items WHERE product_id = ?")
      .run(productId);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Item não encontrado no carrinho" });
    }

    res.json({ message: "Item removido do carrinho" });
  });

  return router;
}

module.exports = { createCartRoutes };
