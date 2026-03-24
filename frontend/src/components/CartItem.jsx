import QuantitySelector from './QuantitySelector';
import { useCart } from '../context/CartContext';

function formatPrice(price) {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="cart-item" id={`cart-item-${item.productId}`}>
      {item.image ? (
        <img
          className="cart-item__image"
          src={item.image}
          alt={item.name}
        />
      ) : (
        <div className="cart-item__image cart-item__no-image">
          <span className="cart-item__no-image-icon">📦</span>
        </div>
      )}

      <div className="cart-item__info">
        <span className="cart-item__name" title={item.name}>{item.name}</span>
        <span className="cart-item__price">{formatPrice(item.price)} cada</span>
        <span className="cart-item__subtotal">{formatPrice(item.subtotal)}</span>

        <div className="cart-item__actions">
          <QuantitySelector
            quantity={item.quantity}
            onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
            onDecrease={() => updateQuantity(item.productId, item.quantity - 1)}
          />
        </div>
      </div>

      <button
        className="cart-item__remove"
        onClick={() => removeItem(item.productId)}
        aria-label={`Remover ${item.name} do carrinho`}
        title="Remover item"
      >
        🗑️
      </button>
    </div>
  );
}
