import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import CartItem from './CartItem';

function formatPrice(price) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export default function CartModal({ onCheckoutSuccess }) {
  const { cart, isCartOpen, closeCart, doCheckout, isLoading } = useCart();
  const [isClosing, setIsClosing] = useState(false);

  // Fechar com animação
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      closeCart();
    }, 300);
  };

  // Fechar com Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen]);

  // Bloquear scroll do body quando aberto
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  const handleCheckout = async () => {
    const result = await doCheckout();
    if (result) {
      onCheckoutSuccess(result);
    }
  };

  if (!isCartOpen) return null;

  return (
    <div
      className={`cart-overlay ${isClosing ? 'cart-overlay--closing' : ''}`}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Carrinho de compras"
    >
      <div className="cart-panel" id="cart-panel">
        {/* Header */}
        <div className="cart-panel__header">
          <h2 className="cart-panel__title">
            <span aria-hidden="true">🛒</span>
            Carrinho
            {cart.itemCount > 0 && (
              <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>
                ({cart.itemCount} {cart.itemCount === 1 ? 'item' : 'itens'})
              </span>
            )}
          </h2>
          <button
            className="cart-panel__close"
            onClick={handleClose}
            aria-label="Fechar carrinho"
            id="close-cart"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="cart-panel__body">
          {cart.items.length === 0 ? (
            <div className="cart-panel__empty">
              <span className="cart-panel__empty-icon" aria-hidden="true">🛒</span>
              <span className="cart-panel__empty-text">Seu carrinho está vazio</span>
              <button className="btn btn--ghost" onClick={handleClose}>
                Continuar comprando
              </button>
            </div>
          ) : (
            cart.items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="cart-panel__footer">
            <div className="cart-summary">
              <div className="cart-summary__row">
                <span>Subtotal ({cart.itemCount} {cart.itemCount === 1 ? 'item' : 'itens'})</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
              <div className="cart-summary__row">
                <span>Frete</span>
                <span style={{ color: 'var(--color-success)' }}>Grátis</span>
              </div>
              <div className="cart-summary__total">
                <span>Total</span>
                <span className="cart-summary__total-value">{formatPrice(cart.total)}</span>
              </div>
            </div>

            <button
              className="btn btn--success btn--lg btn--full"
              onClick={handleCheckout}
              disabled={isLoading}
              id="checkout-button"
            >
              {isLoading ? 'Processando...' : '✓ Finalizar Pedido'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
