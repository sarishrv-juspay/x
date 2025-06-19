const express = require('express');
const router = express.Router();
const { 
  getCart, 
  addOrUpdateCartItem, 
  updateCartItemQuantity, 
  removeCartItem 
} = require('../controllers/cartController');
// const { protect } = require('../middleware/authMiddleware'); // If cart is user-specific

// For a global cart, these routes might be public.
// If user-specific, they would be protected.

// @route   GET /api/cart
router.get('/', getCart); // router.get('/', protect, getCart);

// @route   POST /api/cart/item
router.post('/item', addOrUpdateCartItem); // router.post('/item', protect, addOrUpdateCartItem);

// @route   PUT /api/cart/item/:productId
router.put('/item/:productId', updateCartItemQuantity); // router.put('/item/:productId', protect, updateCartItemQuantity);

// @route   DELETE /api/cart/item/:productId
router.delete('/item/:productId', removeCartItem); // router.delete('/item/:productId', protect, removeCartItem);

module.exports = router;
