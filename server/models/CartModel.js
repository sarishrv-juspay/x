const mongoose = require('mongoose');

/**
 * Mongoose Schema for individual items within a Cart.
 * This is a sub-document schema.
 * It stores denormalized product information for quick access and historical accuracy if product details change.
 */
const cartItemSchema = new mongoose.Schema(
  {
    productId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product', // Reference to the Product model
      required: true 
    },
    name: { 
      type: String, 
      required: true 
    }, // Denormalized from Product
    price: { 
      type: Number, 
      required: true 
    }, // Denormalized from Product (price at time of adding to cart)
    image: { 
      type: String 
    }, // Denormalized from Product
    quantity: { 
      type: Number, 
      required: true, 
      min: [1, 'Quantity must be at least 1'] 
    },
  }, 
  { 
    _id: false // Cart items are identified by productId within the items array, no separate _id needed.
  }
);

/**
 * Mongoose Schema for Carts.
 * Defines the structure of cart documents in MongoDB.
 * Currently implements a single global cart for simplicity.
 */
const cartSchema = new mongoose.Schema(
  {
    // For a multi-user system, a userId field would be essential:
    // userId: { 
    //   type: mongoose.Schema.Types.ObjectId, 
    //   ref: 'User', // Reference to a User model
    //   required: true, 
    //   unique: true // Each user has one cart
    // },
    items: [cartItemSchema], // Array of cart items
    updatedAt: { 
      type: Date, 
      default: Date.now 
    }, // Timestamp of the last cart modification
  },
  {
    timestamps: { createdAt: true, updatedAt: 'updatedAt' }, // Use 'updatedAt' for updates, also add 'createdAt'
  }
);

// Optional: Instance method to calculate total cart value.
// This can also be calculated on the client-side or in controller logic when fetching the cart.
// cartSchema.methods.getCartTotal = function() {
//   return this.items.reduce((total, item) => total + item.quantity * item.price, 0);
// };

// Create the Cart model from the schema
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
