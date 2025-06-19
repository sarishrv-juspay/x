import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

function Header() {
  const { cartItems } = useCart();
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <header>
      <h1>My Store</h1>
      <nav>
        <Link to="/">Home</Link>
        {/* <Link to="/products">Products</Link>  // Assuming no separate products page for now */}
        <Link to="/cart">
          Cart {cartItemCount > 0 && <span className="cart-count">({cartItemCount})</span>}
        </Link>
      </nav>
    </header>
  );
}

export default Header;
