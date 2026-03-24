import { useCart } from '../context/CartContext';

export default function Header({ searchTerm, onSearchChange }) {
  const { cart, openCart } = useCart();

  return (
    <header className="header" role="banner">
      <div className="header__inner">
        <div className="header__logo">
          <div className="header__logo-icon" aria-hidden="true">🛍️</div>
          <span className="header__logo-text">Luttech Store</span>
        </div>

        <div className="search-bar">
          <span className="search-bar__icon" aria-hidden="true">🔍</span>
          <input
            id="search-input"
            type="text"
            className="search-bar__input"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Buscar produtos"
          />
        </div>

        <div className="header__actions">
          <button
            id="cart-button"
            className="cart-button"
            onClick={openCart}
            aria-label={`Carrinho com ${cart.itemCount} itens`}
          >
            <span className="cart-button__icon" aria-hidden="true">🛒</span>
            <span>Carrinho</span>
            {cart.itemCount > 0 && (
              <span className="cart-button__badge" key={cart.itemCount}>
                {cart.itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
