/**
 * Middleware de tratamento de erros.
 * Captura erros não tratados e retorna uma resposta padronizada.
 */
function errorHandler(err, req, res, _next) {
  console.error("❌ Erro:", err.message);

  if (err.code === "SQLITE_CONSTRAINT") {
    return res.status(409).json({
      error: "Conflito de dados. Verifique se o item já existe.",
    });
  }

  res.status(err.status || 500).json({
    error: err.message || "Erro interno do servidor",
  });
}

module.exports = { errorHandler };
