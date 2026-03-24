import { useState, useEffect, useMemo } from 'react';
import * as api from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

export default function Home({ searchTerm }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setIsLoading(true);
        const data = await api.fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  // Extrair categorias únicas
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return cats.sort();
  }, [products]);

  // Filtrar produtos por busca e categoria
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !selectedCategory ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  if (isLoading) {
    return (
      <div className="loading">
        <div className="loading__spinner"></div>
      </div>
    );
  }

  return (
    <main className="products-section">
      <div className="container">
        {/* Filtros de categoria */}
        <nav className="category-filters" aria-label="Filtrar por categoria">
          <button
            className={`category-chip ${!selectedCategory ? 'category-chip--active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-chip ${selectedCategory === cat ? 'category-chip--active' : ''}`}
              onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </nav>

        {/* Contagem de resultados */}
        <p className="products-section__count">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
          {searchTerm && ` para "${searchTerm}"`}
          {selectedCategory && ` em ${selectedCategory}`}
        </p>

        {/* Grid de produtos */}
        <section className="products-grid" aria-label="Lista de produtos">
          {filteredProducts.length === 0 ? (
            <div className="products-empty">
              <div className="products-empty__icon">🔍</div>
              <p className="products-empty__text">Nenhum produto encontrado</p>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                Tente buscar com outros termos ou limpe os filtros
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={setSelectedProduct}
              />
            ))
          )}
        </section>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  );
}

