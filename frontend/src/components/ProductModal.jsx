import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

/**
 * Formata valor em Reais (BRL).
 */
function formatPrice(price) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export default function ProductModal({ product, onClose }) {
  const { addToCart, isLoading } = useCart();
  const [isClosing, setIsClosing] = useState(false);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') handleClose();
    }
    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll while modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, []);

  function handleClose() {
    setIsClosing(true);
    setTimeout(() => onClose(), 280);
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) handleClose();
  }

  function handleAddToCart() {
    addToCart(product.id);
    handleClose();
  }

  if (!product) return null;

  return (
    <div
      className={`product-modal-overlay ${isClosing ? 'product-modal-overlay--closing' : ''}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      id="product-modal"
    >
      <div className="product-modal">
        {/* Close button */}
        <button
          className="product-modal__close"
          onClick={handleClose}
          aria-label="Fechar detalhes do produto"
          id="product-modal-close"
        >
          ✕
        </button>

        {/* Image */}
        <div className="product-modal__image-wrapper">
          {product.image ? (
            <img
              className="product-modal__image"
              src={product.image}
              alt={product.name}
            />
          ) : (
            <div className="product-modal__image product-modal__no-image">
              <span className="product-modal__no-image-icon">📦</span>
              <span className="product-modal__no-image-text">Sem imagem</span>
            </div>
          )}
          <span className="product-modal__category">{product.category}</span>
        </div>

        {/* Content */}
        <div className="product-modal__content">
          <h2 className="product-modal__name" id="product-modal-title">
            {product.name}
          </h2>

          <div className="product-modal__price">
            <span className="product-modal__price-currency">R$ </span>
            {product.price.toFixed(2).replace('.', ',')}
          </div>

          <div className="product-modal__divider" />

          <p className="product-modal__description">{product.description}</p>

          <button
            className="btn btn--primary btn--lg btn--full product-modal__add-btn"
            onClick={handleAddToCart}
            disabled={isLoading}
            id={`modal-add-to-cart-${product.id}`}
          >
            🛒 Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
}
