const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel'); // Potentially used for stock updates or price verification
const Cart = require('../models/CartModel');    // Used to clear the cart after successful order placement

/**
 * @desc    Create a new order from cart items.
 * @route   POST /api/orders
 * @access  Public (Ideally Private/User specific in a real application with authentication)
 * @param   {object} req - Express request object. Expected body: { items: Array, totalAmount: Number }
 * @param   {object} res - Express response object.
 */
const addOrderItems = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    // Validate incoming data
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No order items provided.' });
    }
    if (totalAmount === undefined || typeof totalAmount !== 'number' || totalAmount < 0) {
      return res.status(400).json({ message: 'Invalid or missing total amount.' });
    }

    // Map client-side cart items to the structure defined in OrderItemSchema
    // It's crucial that `item.productId` from the client matches the `_id` of a Product
    const orderItems = items.map(item => ({
      productId: item.productId, // This should be the MongoDB _id of the product
      name: item.name,
      quantity: item.quantity,
      price: item.price,       // Price at the time of order
      image: item.image,       // Image URL at the time of order
    }));
    
    // Create a new order instance
    const order = new Order({
      items: orderItems,
      totalAmount,
      // userId: req.user._id, // This would be added if user authentication is in place
      // Other fields like shippingAddress, paymentMethod would be added here
    });

    // Save the order to the database
    const createdOrder = await order.save();

    // After successfully creating an order, clear the persistent cart.
    // This assumes a single global cart for simplicity.
    // In a multi-user system, you'd clear the cart for the specific user (e.g., `await Cart.findOneAndDelete({ userId: req.user._id });`)
    const cart = await Cart.findOne({}); // Find the single global cart
    if (cart) {
      cart.items = []; // Empty the items array
      cart.updatedAt = Date.now();
      await cart.save();
      console.log('Cart cleared after order placement.');
    }

    // Respond with the created order and a 201 (Created) status
    res.status(201).json(createdOrder);
  } catch (err) {
    // Log the error and send a 500 server error response
    console.error('Error in addOrderItems controller:', err.message);
    res.status(500).json({ message: 'Server Error: Could not create the order.' });
  }
};

// Placeholder for future order-related controller functions:
// const getOrderById = async (req, res) => { ... };
// const updateOrderToPaid = async (req, res) => { ... };
// const getMyOrders = async (req, res) => { ... }; // For logged-in users

module.exports = {
  addOrderItems,
  // getOrderById,
  // updateOrderToPaid,
  // getMyOrders,
};
