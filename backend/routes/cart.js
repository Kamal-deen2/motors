const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    // Get or create cart
    let cartResult = await pool.query(
      'SELECT id FROM carts WHERE user_id = $1',
      [req.user.id]
    );

    let cartId;
    if (cartResult.rows.length === 0) {
      const newCart = await pool.query(
        'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
        [req.user.id]
      );
      cartId = newCart.rows[0].id;
    } else {
      cartId = cartResult.rows[0].id;
    }

    // Get cart items
    const itemsResult = await pool.query(`
      SELECT ci.*, t.title, t.price, t.images, t.is_available
      FROM cart_items ci
      JOIN trucks t ON ci.truck_id = t.id
      WHERE ci.cart_id = $1
    `, [cartId]);

    const items = itemsResult.rows.map(row => ({
      id: row.id,
      truckId: row.truck_id,
      title: row.title,
      price: parseFloat(row.price),
      quantity: row.quantity,
      images: row.images,
      isAvailable: row.is_available
    }));

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({
      success: true,
      items,
      total,
      count: items.length
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Add item to cart
router.post('/', auth, [
  body('truckId').isInt().withMessage('Valid truck ID is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { truckId, quantity = 1 } = req.body;

    // Check if truck exists and is available
    const truckResult = await pool.query(
      'SELECT id, is_available FROM trucks WHERE id = $1',
      [truckId]
    );

    if (truckResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Truck not found' });
    }

    if (!truckResult.rows[0].is_available) {
      return res.status(400).json({ success: false, message: 'Truck is not available' });
    }

    // Get or create cart
    let cartResult = await pool.query(
      'SELECT id FROM carts WHERE user_id = $1',
      [req.user.id]
    );

    let cartId;
    if (cartResult.rows.length === 0) {
      const newCart = await pool.query(
        'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
        [req.user.id]
      );
      cartId = newCart.rows[0].id;
    } else {
      cartId = cartResult.rows[0].id;
    }

    // Check if item already in cart
    const existingItem = await pool.query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND truck_id = $2',
      [cartId, truckId]
    );

    if (existingItem.rows.length > 0) {
      // Update quantity
      await pool.query(
        'UPDATE cart_items SET quantity = quantity + $1 WHERE id = $2',
        [quantity, existingItem.rows[0].id]
      );
    } else {
      // Add new item
      await pool.query(
        'INSERT INTO cart_items (cart_id, truck_id, quantity) VALUES ($1, $2, $3)',
        [cartId, truckId, quantity]
      );
    }

    res.json({ success: true, message: 'Item added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update cart item quantity
router.put('/items/:id', auth, [
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { quantity } = req.body;

    await pool.query(
      'UPDATE cart_items SET quantity = $1 WHERE id = $2',
      [quantity, req.params.id]
    );

    res.json({ success: true, message: 'Cart item updated' });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Remove item from cart
router.delete('/items/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM cart_items WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Clear cart
router.delete('/', auth, async (req, res) => {
  try {
    const cartResult = await pool.query(
      'SELECT id FROM carts WHERE user_id = $1',
      [req.user.id]
    );

    if (cartResult.rows.length > 0) {
      await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartResult.rows[0].id]);
    }

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
