import React from 'react';
import { useCart } from '../context/CartContext'; // Import useCart
import './ProductCard.css';

function ProductCard({ product }) {
  const { addToCart } = useCart(); // Get addToCart function

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: ${product.price.toFixed(2)}</p> {/* Ensure price is formatted */}
      <button onClick={() => addToCart(product)}>Add to Cart</button>
      <button>Buy Now</button> {/* Buy Now functionality not implemented yet */}
    </div>
  );
}

export default ProductCard;
