const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { auth, adminAuth } = require('../middleware/auth');

// Get dashboard stats
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const [
      totalSales,
      totalOrders,
      totalUsers,
      totalTrucks,
      pendingOrders,
      recentOrders
    ] = await Promise.all([
      pool.query('SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE payment_status = $1', ['paid']),
      pool.query('SELECT COUNT(*) as count FROM orders'),
      pool.query('SELECT COUNT(*) as count FROM users'),
      pool.query('SELECT COUNT(*) as count FROM trucks WHERE is_available = true'),
      pool.query('SELECT COUNT(*) as count FROM orders WHERE status = $1', ['pending']),
      pool.query(`
        SELECT o.*, u.full_name, u.email
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 5
      `)
    ]);

    res.json({
      success: true,
      stats: {
        totalSales: parseFloat(totalSales.rows[0].total),
        totalOrders: parseInt(totalOrders.rows[0].count),
        totalUsers: parseInt(totalUsers.rows[0].count),
        totalTrucks: parseInt(totalTrucks.rows[0].count),
        pendingOrders: parseInt(pendingOrders.rows[0].count),
        recentOrders: recentOrders.rows.map(row => ({
          id: row.id,
          orderNumber: row.order_number,
          totalAmount: parseFloat(row.total_amount),
          status: row.status,
          customerName: row.full_name,
          customerEmail: row.email,
          createdAt: row.created_at
        }))
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get all orders (admin)
router.get('/orders', auth, adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = `
      SELECT o.*, u.full_name, u.email,
             json_agg(json_build_object(
               'id', oi.id,
               'truckId', oi.truck_id,
               'truckTitle', oi.truck_title,
               'truckPrice', oi.truck_price,
               'quantity', oi.quantity
             )) as items
      FROM orders o
      JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
    `;
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` WHERE o.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    query += ` GROUP BY o.id, u.full_name, u.email ORDER BY o.created_at DESC`;
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, (page - 1) * limit);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      orders: result.rows.map(row => ({
        id: row.id,
        orderNumber: row.order_number,
        userId: row.user_id,
        customerName: row.full_name,
        customerEmail: row.email,
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
    console.error('Get admin orders error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update order status
router.put('/orders/:id/status', auth, adminAuth, [
  body('status').isIn(['pending', 'processing', 'shipped', 'in_transit', 'delivered', 'cancelled'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { status, trackingNumber } = req.body;

    let query = 'UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP';
    const values = [status];
    let paramCount = 2;

    if (trackingNumber) {
      query += `, tracking_number = $${paramCount}`;
      values.push(trackingNumber);
      paramCount++;
    }

    values.push(req.params.id);
    query += ` WHERE id = $${paramCount}`;

    await pool.query(query, values);

    res.json({ success: true, message: 'Order status updated' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update payment status
router.put('/orders/:id/payment', auth, adminAuth, [
  body('paymentStatus').isIn(['pending', 'paid', 'failed', 'refunded'])
    .withMessage('Invalid payment status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { paymentStatus } = req.body;

    await pool.query(
      'UPDATE orders SET payment_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [paymentStatus, req.params.id]
    );

    res.json({ success: true, message: 'Payment status updated' });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get sales report
router.get('/reports/sales', auth, adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        SUM(total_amount) as revenue
      FROM orders
      WHERE payment_status = 'paid'
    `;
    const params = [];
    let paramCount = 1;

    if (startDate) {
      query += ` AND created_at >= $${paramCount}`;
      params.push(startDate);
      paramCount++;
    }

    if (endDate) {
      query += ` AND created_at <= $${paramCount}`;
      params.push(endDate);
      paramCount++;
    }

    query += ` GROUP BY DATE(created_at) ORDER BY date DESC`;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      report: result.rows.map(row => ({
        date: row.date,
        orders: parseInt(row.orders),
        revenue: parseFloat(row.revenue)
      }))
    });
  } catch (error) {
    console.error('Get sales report error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
