const mongoose = require('mongoose');

/**
 * Mongoose Schema for individual items within an Order.
 * This is a sub-document schema.
 */
const orderItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', // Reference to the Product model
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  }, // Denormalized from Product for historical record
  quantity: { 
    type: Number, 
    required: true, 
    min: [1, 'Quantity must be at least 1'] 
  },
  price: { 
    type: Number, 
    required: true 
  }, // Price at the time of order
  image: { 
    type: String 
  }, // Optional, denormalized from Product
}, { _id: false }); // No separate _id for order items

/**
 * Mongoose Schema for Orders.
 * Defines the structure of order documents in MongoDB.
 */
const orderSchema = new mongoose.Schema(
  {
    // userId: { // Uncomment and use when user authentication is implemented
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: 'User', // Reference to a User model
    // },
    items: [orderItemSchema], // Array of order items
    totalAmount: { 
      type: Number, 
      required: [true, 'Total order amount is required'] 
    },
    // Example: Shipping Address (can be a sub-document or separate model)
    // shippingAddress: {
    //   fullName: { type: String, required: true },
    //   address: { type: String, required: true },
    //   city: { type: String, required: true },
    //   postalCode: { type: String, required: true },
    //   country: { type: String, required: true },
    // },
    // Example: Payment Result (details from payment gateway)
    // paymentResult: {
    //   id: { type: String }, // Payment gateway transaction ID
    //   status: { type: String }, // e.g., 'succeeded', 'pending', 'failed'
    //   update_time: { type: String }, // Timestamp from payment gateway
    //   email_address: { type: String }, // Payer's email from payment gateway
    // },
    // orderStatus: {
    //   type: String,
    //   required: true,
    //   enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    //   default: 'Pending',
    // },
    // isPaid: { 
    //   type: Boolean, 
    //   default: false 
    // },
    // paidAt: { 
    //   type: Date 
    // },
    // isDelivered: { 
    //   type: Boolean, 
    //   default: false 
    // },
    // deliveredAt: { 
    //   type: Date 
    // },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Order model from the schema
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
