const Cart = require('../models/CartModel');
const Product = require('../models/ProductModel'); // Needed to fetch product details for new cart items

/**
 * Helper function to retrieve the single global cart or create it if it doesn't exist.
 * For a multi-user application, this function would be modified to find/create a cart
 * based on the authenticated user's ID (e.g., `req.user._id`).
 * @param {string|null} userId - The ID of the user (currently unused, for future expansion).
 * @returns {Promise<object>} The Mongoose cart document.
 */
async function getOrCreateCart(userId = null) {
  // Current implementation uses a single global cart.
  // To make it user-specific, the query would be e.g., Cart.findOne({ userId: userId })
  let cart = await Cart.findOne({}); 
  if (!cart) {
    // If no cart exists (e.g., first run or DB cleared), create a new one.
    cart = new Cart({ items: [] /*, userId: userId */ }); // Add userId if implementing user-specific carts
    await cart.save();
    console.log('New global cart created.');
  }
  return cart;
}

/**
 * @desc    Get the current persistent cart.
 * @route   GET /api/cart
 * @access  Public (would be Private/User-specific in a real app)
 * @param   {object} req - Express request object.
 * @param   {object} res - Express response object.
 */
const getCart = async (req, res) => {
  try {
    // const userId = req.user ? req.user._id : null; // Example for user-specific cart
    const cart = await getOrCreateCart(/* userId */);
    res.json(cart);
  } catch (err) {
    console.error('Error in getCart controller:', err.message);
    res.status(500).json({ message: 'Server Error: Could not fetch cart.' });
  }
};

/**
 * @desc    Add a new item to the cart or update its quantity if it already exists.
 *          Expects `productId` and optionally `quantity` in the request body.
 *          Product details (name, price, image) are fetched from the Product model.
 * @route   POST /api/cart/item
 * @access  Public (would be Private/User-specific)
 * @param   {object} req - Express request object. Body: { productId: string, quantity?: number }
 * @param   {object} res - Express response object.
 */
const addOrUpdateCartItem = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body; // Default quantity to 1 if not provided
    // const userId = req.user ? req.user._id : null; // For user-specific cart

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const cart = await getOrCreateCart(/* userId */);
    const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (existingItemIndex > -1) {
      // Product already in cart, update quantity
      cart.items[existingItemIndex].quantity += Number(quantity);
    } else {
      // Product not in cart, add as a new item
      cart.items.push({ 
        productId: product._id, // Use the actual ObjectId from the product
        name: product.name, 
        price: product.price, 
        image: product.image, 
        quantity: Number(quantity) 
      });
    }
    
    cart.updatedAt = Date.now(); // Manually update timestamp
    await cart.save(); // Save changes to the database
    res.json(cart); // Return the updated cart
  } catch (err) {
    console.error('Error in addOrUpdateCartItem controller:', err.message);
    res.status(500).json({ message: 'Server Error: Could not add/update cart item.' });
  }
};

/**
 * @desc    Update the quantity of an existing item in the cart.
 *          If quantity becomes 0, the item is removed.
 * @route   PUT /api/cart/item/:productId
 * @access  Public (would be Private/User-specific)
 * @param   {object} req - Express request object. Params: { productId: string }, Body: { quantity: number }
 * @param   {object} res - Express response object.
 */
const updateCartItemQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    // const userId = req.user ? req.user._id : null; // For user-specific cart

    if (quantity === undefined || Number(quantity) < 0) {
      return res.status(400).json({ message: 'Invalid quantity provided.' });
    }

    const cart = await getOrCreateCart(/* userId */);
    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      if (Number(quantity) === 0) {
        // If quantity is 0, remove the item from the cart
        cart.items.splice(itemIndex, 1);
      } else {
        // Otherwise, update the quantity
        cart.items[itemIndex].quantity = Number(quantity);
      }
      cart.updatedAt = Date.now();
      await cart.save();
      res.json(cart);
    } else {
      // Item not found in the cart
      res.status(404).json({ message: 'Item not found in cart.' });
    }
  } catch (err) {
    console.error('Error in updateCartItemQuantity controller:', err.message);
    res.status(500).json({ message: 'Server Error: Could not update cart item quantity.' });
  }
};

/**
 * @desc    Remove an item completely from the cart.
 * @route   DELETE /api/cart/item/:productId
 * @access  Public (would be Private/User-specific)
 * @param   {object} req - Express request object. Params: { productId: string }
 * @param   {object} res - Express response object.
 */
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    // const userId = req.user ? req.user._id : null; // For user-specific cart
    const cart = await getOrCreateCart(/* userId */);
    
    const initialLength = cart.items.length;
    // Filter out the item to be removed
    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    if (cart.items.length < initialLength) {
      // If an item was actually removed, save the cart
      cart.updatedAt = Date.now();
      await cart.save();
      res.json(cart); // Return the updated cart
    } else {
      // If no item was removed (e.g., productId not found), inform the client
      res.status(404).json({ message: 'Item not found in cart, no changes made.', cart });
    }
  } catch (err) {
    console.error('Error in removeCartItem controller:', err.message);
    res.status(500).json({ message: 'Server Error: Could not delete cart item.' });
  }
};

module.exports = {
  getCart,
  addOrUpdateCartItem,
  updateCartItemQuantity,
  removeCartItem,
};
