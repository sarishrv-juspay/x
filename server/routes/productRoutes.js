const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById,
  // createProduct, // Placeholder for admin functionality
  // updateProduct, // Placeholder for admin functionality
  // deleteProduct  // Placeholder for admin functionality
} = require('../controllers/productController');
// const { protect, admin } = require('../middleware/authMiddleware'); // Example for protected/admin routes

// --- Public Routes ---

// Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', getProducts);

// Fetch a single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', getProductById);


// --- Admin Routes (Example placeholders) ---
// These routes would typically be protected and restricted to admin users.

// Create a new product
// @route   POST /api/products
// @access  Private/Admin
// router.post('/', protect, admin, createProduct);

// Update an existing product
// @route   PUT /api/products/:id
// @access  Private/Admin
// router.put('/:id', protect, admin, updateProduct);

// Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
// router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
