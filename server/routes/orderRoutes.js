const express = require('express');
const router = express.Router();
const { addOrderItems } = require('../controllers/orderController');
// const { protect } = require('../middleware/authMiddleware'); // Example for protected routes

// @route   POST /api/orders
router.post('/', addOrderItems); // In a real app, this would be protected: router.post('/', protect, addOrderItems);

// Add other order routes like:
// router.get('/myorders', protect, getMyOrders);
// router.get('/:id', protect, getOrderById);
// router.put('/:id/pay', protect, updateOrderToPaid);
// router.put('/:id/deliver', protect, admin, updateOrderToDelivered); // Example admin route

module.exports = router;
