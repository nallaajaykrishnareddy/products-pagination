import { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';

const ITEMS_PER_PAGE = 5;

function App() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();
        setProducts(data.products);
      } catch (err) {
        setError('Error fetching products.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleNext = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const currentProducts = useMemo(() => {
    return products.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [currentPage, products]);

  const renderPaginationButtons = useMemo(() => {
    const pages = products.length / ITEMS_PER_PAGE;

    return Array(pages)
      .fill(null)
      .map((u, i) => i)
      .map((value, index) => {
        return (
          <button key={value} onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </button>
        );
      });
  }, [products]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  console.log(renderPaginationButtons);

  return (
    <>
      <h1>Products</h1>
      <div className="container">
        {currentProducts.map((product) => (
          <div className="product-container" key={product.id}>
            <img
              src={product.images[0] || 'placeholder-image-url'}
              alt={product.title || 'Product Image'}
              className="img-style"
              loading="lazy"
            />
            <div className="text-container">
              <h5>{product.title}</h5>
              <h5>${product.price}</h5>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination-container">
        <button onClick={handlePrev} disabled={currentPage === 1}>
          Prev
        </button>
        {renderPaginationButtons}
        <button
          onClick={handleNext}
          disabled={currentPage * ITEMS_PER_PAGE >= products.length}
        >
          Next
        </button>
      </div>
    </>
  );
}

export default App;
