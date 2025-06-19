import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();
const API_URL = 'http://localhost:5001/api/cart'; // Assuming server runs on 5001

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  // Fetch initial cart from server
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoadingCart(true);
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCartItems(data.items || []);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        // setCartItems([]); // Optionally set to empty on error or keep previous state
      } finally {
        setLoadingCart(false);
      }
    };
    fetchCart();
  }, []);

  const addToCart = async (product) => {
    try {
      // Note: product.id from frontend might be product._id from backend
      const response = await fetch(`${API_URL}/item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          productId: product._id || product.id, // Use _id if available (from DB)
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1 // Add one item, server will handle incrementing if exists
        }),
      });
      if (!response.ok) throw new Error('Failed to add item to cart');
      const updatedCart = await response.json();
      setCartItems(updatedCart.items);
    } catch (error) {
      console.error('addToCart error:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/item/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove item from cart');
      const updatedCart = await response.json();
      setCartItems(updatedCart.items);
    } catch (error) {
      console.error('removeFromCart error:', error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 0) return; // Should not happen with UI controls, but good check

    try {
      const response = await fetch(`${API_URL}/item/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) throw new Error('Failed to update item quantity');
      const updatedCart = await response.json();
      setCartItems(updatedCart.items);
    } catch (error) {
      console.error('updateQuantity error:', error);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const value = {
    cartItems,
    loadingCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
