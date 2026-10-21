import { memo, useCallback, useEffect, useMemo, useState } from 'react'

const PRODUCT_COUNT = 500
const PRODUCT_CATEGORIES = ['Audio', 'Camera', 'Gaming', 'Home', 'Office', 'Travel']
const ADJECTIVES = ['Aurora', 'Nimbus', 'Summit', 'Pilot', 'Cedar', 'Vertex', 'Ridge', 'Signal']
const NOUNS = ['Headset', 'Laptop', 'Monitor', 'Speaker', 'Tablet', 'Camcorder', 'Keyboard', 'Projector']

const PRODUCTS = Array.from({ length: PRODUCT_COUNT }, (_, index) => {
  const category = PRODUCT_CATEGORIES[index % PRODUCT_CATEGORIES.length]
  const adjective = ADJECTIVES[index % ADJECTIVES.length]
  const noun = NOUNS[(index * 3) % NOUNS.length]
  const price = 35 + ((index * 17) % 820)

  return {
    id: index + 1,
    name: `${adjective} ${noun}`,
    category,
    price,
    rating: Number((3.5 + ((index * 7) % 20) / 10).toFixed(1)),
  }
})

const ProductList = memo(function ProductList({ products, selectedProductId, onSelect }) {
  console.log('ProductList rendered with', products.length, 'items')

  return (
    <ul className="product-list" aria-live="polite">
      {products.map((product) => (
        <li key={product.id}>
          <button
            type="button"
            className={product.id === selectedProductId ? 'product-card selected' : 'product-card'}
            onClick={() => onSelect(product.id)}
          >
            <span className="product-name">{product.name}</span>
            <span className="product-meta">{product.category}</span>
            <span className="product-meta">${product.price}</span>
            <span className="product-meta">★ {product.rating}</span>
          </button>
        </li>
      ))}
    </ul>
  )
})

function App() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortOrder, setSortOrder] = useState('asc')
  const [counter, setCounter] = useState(0)
  const [selectedProductId, setSelectedProductId] = useState(PRODUCTS[0].id)

  const categories = useMemo(
    () => ['All', ...new Set(PRODUCTS.map((product) => product.category))],
    [],
  )

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    const matches = PRODUCTS.filter((product) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery)

      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory

      return matchesQuery && matchesCategory
    })

    return [...matches].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.price - b.price
      }

      return b.price - a.price
    })
  }, [query, selectedCategory, sortOrder])

  const selectedProduct = useMemo(
    () => filteredProducts.find((product) => product.id === selectedProductId) ?? null,
    [filteredProducts, selectedProductId],
  )

  useEffect(() => {
    if (!selectedProduct && filteredProducts.length > 0) {
      setSelectedProductId(filteredProducts[0].id)
      return
    }

    if (!selectedProduct && filteredProducts.length === 0) {
      setSelectedProductId(null)
    }
  }, [filteredProducts, selectedProduct])

  const handleSelectProduct = useCallback((productId) => {
    setSelectedProductId(productId)
  }, [])

  useEffect(() => {
    if (selectedProduct) {
      console.log(`Analytics: selected ${selectedProduct.name} (${selectedProduct.category})`)
    }
  }, [selectedProduct])

  return (
    <main className="app-shell">
      <header className="toolbar">
        <div>
          <p className="eyebrow">Product Explorer</p>
          <h1>Performance Repair</h1>
        </div>
        <button type="button" className="counter-button" onClick={() => setCounter((value) => value + 1)}>
          Unrelated counter: {counter}
        </button>
      </header>

      <section className="controls" aria-label="Product filtering controls">
        <label className="input-block">
          <span>Search</span>
          <input
            type="search"
            value={query}
            placeholder="Search products"
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <label className="input-block">
          <span>Category</span>
          <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="input-block">
          <span>Price sorting</span>
          <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
            <option value="asc">Low to high</option>
            <option value="desc">High to low</option>
          </select>
        </label>
      </section>

      <section className="content" aria-live="polite">
        <div className="summary-panel">
          <p>
            Showing <strong>{filteredProducts.length}</strong> of <strong>{PRODUCTS.length}</strong> products
          </p>
          {selectedProduct ? (
            <div className="selection-card">
              <h2>{selectedProduct.name}</h2>
              <p>{selectedProduct.category}</p>
              <p>${selectedProduct.price}</p>
            </div>
          ) : (
            <p className="empty-state">No products match the current filters.</p>
          )}
        </div>

        <ProductList
          products={filteredProducts}
          selectedProductId={selectedProductId}
          onSelect={handleSelectProduct}
        />
      </section>
    </main>
  )
}

export default App
