const API_BASE = '/api';

/**
 * Serviço de comunicação com a API do backend.
 * Centraliza todas as chamadas HTTP para facilitar manutenção.
 */

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Erro na requisição');
  }
  return data;
}

// ====== Produtos ======

export async function fetchProducts(search = '', category = '') {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category) params.set('category', category);

  const queryString = params.toString();
  const url = `${API_BASE}/products${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url);
  return handleResponse(response);
}

export async function fetchProductById(id) {
  const response = await fetch(`${API_BASE}/products/${id}`);
  return handleResponse(response);
}

// ====== Carrinho ======

export async function fetchCart() {
  const response = await fetch(`${API_BASE}/cart`);
  return handleResponse(response);
}

export async function addToCart(productId, quantity = 1) {
  const response = await fetch(`${API_BASE}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity }),
  });
  return handleResponse(response);
}

export async function updateCartQuantity(productId, quantity) {
  const response = await fetch(`${API_BASE}/cart/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  return handleResponse(response);
}

export async function removeFromCart(productId) {
  const response = await fetch(`${API_BASE}/cart/${productId}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
}

// ====== Checkout ======

export async function checkout() {
  const response = await fetch(`${API_BASE}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse(response);
}
