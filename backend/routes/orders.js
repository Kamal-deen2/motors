const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

// Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT o.*, 
             json_agg(json_build_object(
               'id', oi.id,
               'truckId', oi.truck_id,
               'truckTitle', oi.truck_title,
               'truckPrice', oi.truck_price,
               'quantity', oi.quantity
             )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.user_id = $1
    `;
    const params = [req.user.id];
    let paramCount = 2;

    if (status) {
      query += ` AND o.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += ` GROUP BY o.id ORDER BY o.created_at DESC`;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      orders: result.rows.map(row => ({
        id: row.id,
        orderNumber: row.order_number,
        totalAmount: parseFloat(row.total_amount),
        status: row.status,
        paymentStatus: row.payment_status,
        paymentMethod: row.payment_method,
        billingAddress: row.billing_address,
        shippingAddress: row.shipping_address,
        trackingNumber: row.tracking_number,
        notes: row.notes,
        items: row.items,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }))
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, 
             json_agg(json_build_object(
               'id', oi.id,
               'truckId', oi.truck_id,
               'truckTitle', oi.truck_title,
               'truckPrice', oi.truck_price,
               'quantity', oi.quantity
             )) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = $1 AND o.user_id = $2
      GROUP BY o.id
    `, [req.params.id, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const row = result.rows[0];
    res.json({
      success: true,
      order: {
        id: row.id,
        orderNumber: row.order_number,
        totalAmount: parseFloat(row.total_amount),
        status: row.status,
        paymentStatus: row.payment_status,
        paymentMethod: row.payment_method,
        billingAddress: row.billing_address,
        shippingAddress: row.shipping_address,
        trackingNumber: row.tracking_number,
        notes: row.notes,
        items: row.items,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create order from cart
router.post('/', auth, [
  body('billingAddress').notEmpty().withMessage('Billing address is required'),
  body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  body('paymentMethod').notEmpty().withMessage('Payment method is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { billingAddress, shippingAddress, paymentMethod, notes } = req.body;

    // Get user's cart
    const cartResult = await pool.query(
      'SELECT id FROM carts WHERE user_id = $1',
      [req.user.id]
    );

    if (cartResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const cartId = cartResult.rows[0].id;

    // Get cart items
    const itemsResult = await pool.query(`
      SELECT ci.*, t.title, t.price, t.is_available
      FROM cart_items ci
      JOIN trucks t ON ci.truck_id = t.id
      WHERE ci.cart_id = $1
    `, [cartId]);

    if (itemsResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Check availability
    for (const item of itemsResult.rows) {
      if (!item.is_available) {
        return res.status(400).json({
          success: false,
          message: `Truck "${item.title}" is no longer available`
        });
      }
    }

    // Calculate total
    const total = itemsResult.rows.reduce(
      (sum, item) => sum + (parseFloat(item.price) * item.quantity),
      0
    );

    // Generate order number
    const orderNumber = `PM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const orderResult = await pool.query(`
      INSERT INTO orders (
        user_id, order_number, total_amount, billing_address,
        shipping_address, payment_method, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `, [req.user.id, orderNumber, total, billingAddress, shippingAddress, paymentMethod, notes]);

    const orderId = orderResult.rows[0].id;

    // Add order items
    for (const item of itemsResult.rows) {
      await pool.query(`
        INSERT INTO order_items (order_id, truck_id, truck_title, truck_price, quantity)
        VALUES ($1, $2, $3, $4, $5)
      `, [orderId, item.truck_id, item.title, item.price, item.quantity]);
    }

    // Clear cart
    await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: orderId,
        orderNumber,
        totalAmount: total
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update order status (admin only - handled in admin route)
module.exports = router;
