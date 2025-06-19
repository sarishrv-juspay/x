import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCard from './components/ProductCard';
// import productsData from './data'; // Will be removed
import CartPage from './pages/CartPage';
import { CartProvider } from './context/CartContext';
import './App.css';

// HomePage component to fetch and display products
function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/products'); // Assuming server runs on 5001
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (e) {
        setError(e.message);
        console.error("Failed to fetch products:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products: {error}</p>;
  if (products.length === 0) return <p>No products available.</p>;

  return (
    <div className="product-list">
      {products.map(product => (
        <ProductCard key={product._id || product.id} product={product} /> // Use _id from MongoDB or id
      ))}
    </div>
  );
}

function App() {
  return (
    <CartProvider> {/* Wrap with CartProvider */}
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
