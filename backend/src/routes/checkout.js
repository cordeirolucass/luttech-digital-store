const express = require("express");

/**
 * Rota de checkout (simulado).
 * POST /api/checkout - Finaliza o pedido marcando como enviado.
 */
function createCheckoutRoutes(db) {
  const router = express.Router();

  /**
   * @swagger
   * /api/checkout:
   *   post:
   *     summary: Finaliza o pedido (simulado)
   *     tags: [Checkout]
   *     description: >
   *       Recebe o carrinho atual, cria um pedido com os itens,
   *       limpa o carrinho e retorna uma mensagem de sucesso.
   *       Nenhum processamento real de pagamento é realizado.
   *     responses:
   *       200:
   *         description: Pedido finalizado com sucesso
   *       400:
   *         description: Carrinho vazio
   */
  router.post("/", (req, res) => {
    // Buscar itens do carrinho
    const cartItems = db
      .prepare(
        `SELECT ci.product_id, ci.quantity, p.price, p.name
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id`
      )
      .all();

    if (cartItems.length === 0) {
      return res.status(400).json({
        error: "Não é possível finalizar o pedido. O carrinho está vazio.",
      });
    }

    // Calcular total
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Criar pedido dentro de uma transação
    const processCheckout = db.transaction(() => {
      // Inserir pedido
      const orderResult = db
        .prepare("INSERT INTO orders (total, status) VALUES (?, 'completed')")
        .run(Math.round(total * 100) / 100);

      const orderId = orderResult.lastInsertRowid;

      // Inserir itens do pedido
      const insertOrderItem = db.prepare(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)"
      );

      for (const item of cartItems) {
        insertOrderItem.run(orderId, item.product_id, item.quantity, item.price);
      }

      // Limpar o carrinho
      db.prepare("DELETE FROM cart_items").run();

      return orderId;
    });

    const orderId = processCheckout();

    res.json({
      message: "Pedido finalizado com sucesso! 🎉",
      order: {
        id: orderId,
        total: Math.round(total * 100) / 100,
        itemCount: cartItems.length,
        items: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        status: "completed",
      },
    });
  });

  return router;
}

module.exports = { createCheckoutRoutes };
