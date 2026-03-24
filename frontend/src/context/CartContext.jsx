import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import { useToast } from './ToastContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Carregar carrinho do backend ao iniciar
  const refreshCart = useCallback(async () => {
    try {
      const data = await api.fetchCart();
      setCart(data);
    } catch (err) {
      console.error('Erro ao carregar carrinho:', err);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(async (productId) => {
    try {
      setIsLoading(true);
      await api.addToCart(productId, 1);
      await refreshCart();
      toast.success('Produto adicionado ao carrinho! 🛒');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [refreshCart, toast]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    try {
      await api.updateCartQuantity(productId, quantity);
      await refreshCart();
    } catch (err) {
      toast.error(err.message);
    }
  }, [refreshCart, toast]);

  const removeItem = useCallback(async (productId) => {
    try {
      await api.removeFromCart(productId);
      await refreshCart();
      toast.info('Produto removido do carrinho');
    } catch (err) {
      toast.error(err.message);
    }
  }, [refreshCart, toast]);

  const doCheckout = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await api.checkout();
      setCart({ items: [], total: 0, itemCount: 0 });
      setIsCartOpen(false);
      return result;
    } catch (err) {
      toast.error(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const value = {
    cart,
    isCartOpen,
    isLoading,
    addToCart,
    updateQuantity,
    removeItem,
    doCheckout,
    openCart,
    closeCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}
