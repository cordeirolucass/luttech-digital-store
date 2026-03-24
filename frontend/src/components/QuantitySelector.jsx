export default function QuantitySelector({ quantity, onIncrease, onDecrease, min = 1, max = 10 }) {
  return (
    <div className="quantity-selector" role="group" aria-label="Seletor de quantidade">
      <button
        className="quantity-selector__btn"
        onClick={onDecrease}
        disabled={quantity <= min}
        aria-label="Diminuir quantidade"
      >
        −
      </button>
      <span className="quantity-selector__value" aria-live="polite">
        {quantity}
      </span>
      <button
        className="quantity-selector__btn"
        onClick={onIncrease}
        disabled={quantity >= max}
        aria-label="Aumentar quantidade"
      >
        +
      </button>
    </div>
  );
}
