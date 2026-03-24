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

export default function ProductCard({ product, onViewDetails }) {
  const { addToCart, isLoading } = useCart();

  function handleCardClick() {
    if (onViewDetails) onViewDetails(product);
  }

  function handleAddToCartClick(e) {
    e.stopPropagation();
    addToCart(product.id);
  }

  return (
    <article
      className="product-card product-card--clickable"
      id={`product-${product.id}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick(); }}
      aria-label={`Ver detalhes de ${product.name}`}
    >
      <div className="product-card__image-wrapper">
        {product.image ? (
          <img
            className="product-card__image"
            src={product.image}
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <div className="product-card__image product-card__no-image">
            <span className="product-card__no-image-icon">📦</span>
            <span className="product-card__no-image-text">Sem imagem</span>
          </div>
        )}
        <span className="product-card__category">{product.category}</span>
      </div>

      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__description">{product.description}</p>

        <div className="product-card__footer">
          <div className="product-card__price">
            <span className="product-card__price-currency">R$ </span>
            {product.price.toFixed(2).replace('.', ',')}
          </div>

          <button
            className="btn btn--primary btn--sm"
            onClick={handleAddToCartClick}
            disabled={isLoading}
            aria-label={`Adicionar ${product.name} ao carrinho`}
            id={`add-to-cart-${product.id}`}
          >
            🛒 Adicionar
          </button>
        </div>
      </div>
    </article>
  );
}
