import React from 'react';
import { useCart } from '../context/CartContext';
import './CartPage.css'; // We'll create this CSS file next

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, loadingCart } = useCart(); // Added loadingCart

  if (loadingCart) {
    return <div className="cart-page"><h2>Loading cart...</h2></div>;
  }

  if (cartItems.length === 0) {
    return <div className="cart-page"><h2>Your cart is empty.</h2></div>;
  }

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      // updateQuantity will handle quantity 0 as removal if backend is set up for it,
      // or we can call removeFromCart directly.
      // Current backend PUT /api/cart/item/:productId handles quantity 0 as removal.
      updateQuantity(productId, 0); 
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      <div className="cart-items-list">
        {cartItems.map((item) => (
          // Assuming item from cartItems has productId, name, price, image, quantity
          <div key={item.productId} className="cart-item"> 
            <img src={item.image || 'https://via.placeholder.com/120'} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h2>{item.name}</h2>
              <p>Price: ${item.price.toFixed(2)}</p>
              <div className="cart-item-quantity">
                <label htmlFor={`quantity-${item.productId}`}>Quantity:</label>
                <input
                  type="number"
                  id={`quantity-${item.productId}`}
                  value={item.quantity}
                  min="0" // Allow 0 for removal via handleQuantityChange
                  onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                />
              </div>
              <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
              <button onClick={() => removeFromCart(item.productId)} className="remove-button">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="order-summary">
        <h2>Order Summary</h2>
        <p>Subtotal: ${getCartTotal().toFixed(2)}</p>
        {/* Add tax, shipping, etc. if needed */}
        <h3>Total: ${getCartTotal().toFixed(2)}</h3>
        <button 
          className="buy-button" 
          onClick={async () => {
            if (cartItems.length === 0) {
              alert('Your cart is empty!');
              return;
            }
            try {
              const orderData = {
                items: cartItems.map(cartItem => ({ 
                  productId: cartItem.productId, // Ensure this matches what backend Order schema expects
                  name: cartItem.name, 
                  quantity: cartItem.quantity, 
                  price: cartItem.price 
                })),
                totalAmount: getCartTotal(),
              };
              const response = await fetch('http://localhost:5001/api/orders', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
              });
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const result = await response.json();
              alert('Order placed successfully! Order ID: ' + (result._id || result.id));
              // Optionally, clear the cart here or redirect
              // cartItems.forEach(item => removeFromCart(item.id)); // Example: clear cart
            } catch (error) {
              console.error('Failed to place order:', error);
              alert('Failed to place order: ' + error.message);
            }
          }}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default CartPage;
