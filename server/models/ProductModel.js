const mongoose = require('mongoose');

/**
 * Mongoose Schema for Products.
 * Defines the structure of product documents in MongoDB.
 */
const productSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Product name is required'] 
    },
    description: { 
      type: String, 
      required: [true, 'Product description is required'] 
    },
    price: { 
      type: Number, 
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    image: { 
      type: String, 
      required: [true, 'Product image URL is required'] 
    },
    // Example of additional fields (can be uncommented and used)
    // category: { 
    //   type: String, 
    //   required: [true, 'Product category is required'] 
    // },
    // brand: {
    //   type: String,
    // },
    // countInStock: { 
    //   type: Number, 
    //   required: true, 
    //   default: 0,
    //   min: [0, 'Stock cannot be negative']
    // },
    // rating: { // Example for product reviews
    //   type: Number,
    //   default: 0,
    // },
    // numReviews: {
    //   type: Number,
    //   default: 0,
    // }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Product model from the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
