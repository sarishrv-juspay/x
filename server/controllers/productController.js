const Product = require('../models/ProductModel');

/**
 * @desc    Fetch all products from the database.
 *          If no products are found, it seeds initial product data.
 * @route   GET /api/products
 * @access  Public
 * @param   {object} req - Express request object.
 * @param   {object} res - Express response object.
 */
const getProducts = async (req, res) => {
  try {
    let products = await Product.find({}); // Fetch all products
    
    // If the database is empty, seed it with initial products
    if (products.length === 0) {
      console.log('No products found in the database. Seeding initial data...');
      const initialProducts = [
        { name: 'Laptop Pro X', description: 'High-performance laptop for professionals and creatives.', price: 1499.99, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29tcHV0ZXJ8ZW58MHx8MHx8fDA%3D&w=1000&q=80' },
        { name: 'Ergo Wireless Mouse', description: 'Ergonomic wireless mouse with customizable buttons.', price: 49.99, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bW91c2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80' },
        { name: 'RGB Mechanical Keyboard', description: 'Backlit RGB mechanical keyboard with tactile switches.', price: 129.99, image: 'https://images.unsplash.com/photo-1587829741301-735c7690534f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8a2V5Ym9hcmR8ZW58MHx8MHx8fDA%3D&w=1000&q=80' },
        { name: '4K Ultra HD Monitor', description: '27-inch 4K UHD monitor with vibrant colors.', price: 399.50, image: 'https://images.unsplash.com/photo-1527443154391-507ea9dc60c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1vbml0b3J8ZW58MHx8MHx8fDA%3D&w=1000&q=80' },
      ];
      // Insert the initial products into the database
      await Product.insertMany(initialProducts);
      // Fetch the products again now that they've been seeded
      products = await Product.find({});
      console.log('Initial data seeded successfully.');
    }
    
    // Send the list of products as a JSON response
    res.json(products);
  } catch (err) {
    // Log the error and send a 500 server error response
    console.error('Error in getProducts controller:', err.message);
    res.status(500).json({ message: 'Server Error: Could not fetch products.' });
  }
};

/**
 * @desc    Fetch a single product by its MongoDB ID.
 * @route   GET /api/products/:id
 * @access  Public
 * @param   {object} req - Express request object, `req.params.id` contains the product ID.
 * @param   {object} res - Express response object.
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      // If product is found, send it as a JSON response
      res.json(product);
    } else {
      // If product is not found, send a 404 error response
      res.status(404).json({ message: 'Product not found.' });
    }
  } catch (err) {
    // Log the error and send a 500 server error response
    // This can happen for various reasons, e.g., invalid ObjectId format
    console.error('Error in getProductById controller:', err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Product not found (invalid ID format).' });
    }
    res.status(500).json({ message: 'Server Error: Could not fetch product.' });
  }
};

// Future admin functionalities can be added here:
// const createProduct = async (req, res) => { ... };
// const updateProduct = async (req, res) => { ... };
// const deleteProduct = async (req, res) => { ... };

module.exports = {
  getProducts,
  getProductById,
  // createProduct, (if implemented)
  // updateProduct, (if implemented)
  // deleteProduct, (if implemented)
};
