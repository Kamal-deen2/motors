const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { auth, adminAuth } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    let query = `
      SELECT id, full_name, email, phone, role, is_verified, is_active, created_at
      FROM users
    `;
    const params = [];
    let paramCount = 1;

    if (search) {
      query += ` WHERE full_name ILIKE $${paramCount} OR email ILIKE $${paramCount}`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, (page - 1) * limit);

    const result = await pool.query(query, params);

    res.json({
      success: true,
      users: result.rows.map(row => ({
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        role: row.role,
        isVerified: row.is_verified,
        isActive: row.is_active,
        createdAt: row.created_at
      }))
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user by ID (admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, full_name, email, phone, role, is_verified, is_active, created_at FROM users WHERE id = $1',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const row = result.rows[0];
    res.json({
      success: true,
      user: {
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        phone: row.phone,
        role: row.role,
        isVerified: row.is_verified,
        isActive: row.is_active,
        createdAt: row.created_at
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { role, isActive, isVerified } = req.body;

    let query = 'UPDATE users SET updated_at = CURRENT_TIMESTAMP';
    const values = [];
    let paramCount = 1;

    if (role) {
      query += `, role = $${paramCount}`;
      values.push(role);
      paramCount++;
    }
    if (isActive !== undefined) {
      query += `, is_active = $${paramCount}`;
      values.push(isActive);
      paramCount++;
    }
    if (isVerified !== undefined) {
      query += `, is_verified = $${paramCount}`;
      values.push(isVerified);
      paramCount++;
    }

    values.push(req.params.id);
    query += ` WHERE id = $${paramCount}`;

    await pool.query(query, values);

    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
