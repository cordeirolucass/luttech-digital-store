function formatPrice(price) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export default function SuccessScreen({ orderData, onClose }) {
  if (!orderData) return null;

  return (
    <div
      className="success-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Pedido finalizado com sucesso"
    >
      <div className="success-card" id="success-screen">
        <div className="success-card__icon">✅</div>
        <h2 className="success-card__title">Pedido Confirmado!</h2>
        <p className="success-card__message">
          Seu pedido foi realizado com sucesso. Em breve você receberá a confirmação por e-mail.
        </p>
        <div className="success-card__order-id">
          Pedido #{orderData.order.id} • {formatPrice(orderData.order.total)}
        </div>
        <br />
        <button
          className="btn btn--primary btn--lg"
          onClick={onClose}
          id="continue-shopping"
        >
          Continuar Comprando
        </button>
      </div>
    </div>
  );
}
