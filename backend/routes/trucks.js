const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { auth, adminAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get all trucks with filters
router.get('/', async (req, res) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      year,
      condition,
      minMileage,
      maxMileage,
      search,
      sort = 'created_at',
      order = 'DESC',
      page = 1,
      limit = 12
    } = req.query;

    let query = `
      SELECT t.*, c.name as category_name,
             (SELECT COUNT(*) FROM trucks) as total_count
      FROM trucks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.is_available = true
    `;
    const params = [];
    let paramCount = 1;

    if (category) {
      query += ` AND t.category_id = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    if (brand) {
      query += ` AND t.brand ILIKE $${paramCount}`;
      params.push(`%${brand}%`);
      paramCount++;
    }

    if (minPrice) {
      query += ` AND t.price >= $${paramCount}`;
      params.push(minPrice);
      paramCount++;
    }

    if (maxPrice) {
      query += ` AND t.price <= $${paramCount}`;
      params.push(maxPrice);
      paramCount++;
    }

    if (year) {
      query += ` AND t.year = $${paramCount}`;
      params.push(year);
      paramCount++;
    }

    if (condition) {
      query += ` AND t.condition ILIKE $${paramCount}`;
      params.push(`%${condition}%`);
      paramCount++;
    }

    if (minMileage) {
      query += ` AND t.mileage >= $${paramCount}`;
      params.push(minMileage);
      paramCount++;
    }

    if (maxMileage) {
      query += ` AND t.mileage <= $${paramCount}`;
      params.push(maxMileage);
      paramCount++;
    }

    if (search) {
      query += ` AND (t.title ILIKE $${paramCount} OR t.brand ILIKE $${paramCount} OR t.model ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    // Add sorting
    const allowedSort = ['created_at', 'price', 'year', 'mileage'];
    const sortField = allowedSort.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    query += ` ORDER BY t.${sortField} ${sortOrder}`;

    // Add pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    const totalCount = result.rows.length > 0 ? result.rows[0].total_count : 0;

    res.json({
      success: true,
      trucks: result.rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        categoryId: row.category_id,
        categoryName: row.category_name,
        brand: row.brand,
        model: row.model,
        year: row.year,
        price: parseFloat(row.price),
        condition: row.condition,
        mileage: row.mileage,
        engine: row.engine,
        transmission: row.transmission,
        fuelType: row.fuel_type,
        color: row.color,
        vin: row.vin,
        images: row.images,
        isFeatured: row.is_featured,
        isAvailable: row.is_available,
        createdAt: row.created_at
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalCount),
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Get trucks error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get featured trucks
router.get('/featured', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, c.name as category_name
      FROM trucks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.is_featured = true AND t.is_available = true
      ORDER BY t.created_at DESC
      LIMIT 6
    `);

    res.json({
      success: true,
      trucks: result.rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        categoryId: row.category_id,
        categoryName: row.category_name,
        brand: row.brand,
        model: row.model,
        year: row.year,
        price: parseFloat(row.price),
        condition: row.condition,
        mileage: row.mileage,
        engine: row.engine,
        transmission: row.transmission,
        fuelType: row.fuel_type,
        color: row.color,
        vin: row.vin,
        images: row.images,
        isFeatured: row.is_featured,
        isAvailable: row.is_available,
        createdAt: row.created_at
      }))
    });
  } catch (error) {
    console.error('Get featured trucks error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get single truck
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, c.name as category_name
      FROM trucks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Truck not found' });
    }

    const row = result.rows[0];
    res.json({
      success: true,
      truck: {
        id: row.id,
        title: row.title,
        description: row.description,
        categoryId: row.category_id,
        categoryName: row.category_name,
        brand: row.brand,
        model: row.model,
        year: row.year,
        price: parseFloat(row.price),
        condition: row.condition,
        mileage: row.mileage,
        engine: row.engine,
        transmission: row.transmission,
        fuelType: row.fuel_type,
        color: row.color,
        vin: row.vin,
        images: row.images,
        isFeatured: row.is_featured,
        isAvailable: row.is_available,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }
    });
  } catch (error) {
    console.error('Get truck error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get categories
router.get('/categories/list', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json({
      success: true,
      categories: result.rows
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create truck (admin only)
router.post('/', adminAuth, upload.array('images', 10), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('categoryId').isInt().withMessage('Valid category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
  body('year').isInt().withMessage('Valid year is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      title,
      description,
      categoryId,
      brand,
      model,
      year,
      price,
      condition,
      mileage,
      engine,
      transmission,
      fuelType,
      color,
      vin,
      isFeatured
    } = req.body;

    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const result = await pool.query(`
      INSERT INTO trucks (
        title, description, category_id, brand, model, year, price,
        condition, mileage, engine, transmission, fuel_type, color, vin,
        images, is_featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `, [
      title, description, categoryId, brand, model, year, price,
      condition, mileage, engine, transmission, fuelType, color, vin,
      images, isFeatured || false
    ]);

    res.status(201).json({
      success: true,
      truck: result.rows[0]
    });
  } catch (error) {
    console.error('Create truck error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update truck (admin only)
router.put('/:id', adminAuth, upload.array('images', 10), async (req, res) => {
  try {
    const {
      title,
      description,
      categoryId,
      brand,
      model,
      year,
      price,
      condition,
      mileage,
      engine,
      transmission,
      fuelType,
      color,
      vin,
      isFeatured,
      isAvailable
    } = req.body;

    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : null;

    let query = `UPDATE trucks SET `;
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (title) {
      updates.push(`title = $${paramCount}`);
      values.push(title);
      paramCount++;
    }
    if (description) {
      updates.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }
    if (categoryId) {
      updates.push(`category_id = $${paramCount}`);
      values.push(categoryId);
      paramCount++;
    }
    if (brand) {
      updates.push(`brand = $${paramCount}`);
      values.push(brand);
      paramCount++;
    }
    if (model) {
      updates.push(`model = $${paramCount}`);
      values.push(model);
      paramCount++;
    }
    if (year) {
      updates.push(`year = $${paramCount}`);
      values.push(year);
      paramCount++;
    }
    if (price) {
      updates.push(`price = $${paramCount}`);
      values.push(price);
      paramCount++;
    }
    if (condition) {
      updates.push(`condition = $${paramCount}`);
      values.push(condition);
      paramCount++;
    }
    if (mileage) {
      updates.push(`mileage = $${paramCount}`);
      values.push(mileage);
      paramCount++;
    }
    if (engine) {
      updates.push(`engine = $${paramCount}`);
      values.push(engine);
      paramCount++;
    }
    if (transmission) {
      updates.push(`transmission = $${paramCount}`);
      values.push(transmission);
      paramCount++;
    }
    if (fuelType) {
      updates.push(`fuel_type = $${paramCount}`);
      values.push(fuelType);
      paramCount++;
    }
    if (color) {
      updates.push(`color = $${paramCount}`);
      values.push(color);
      paramCount++;
    }
    if (vin) {
      updates.push(`vin = $${paramCount}`);
      values.push(vin);
      paramCount++;
    }
    if (images && images.length > 0) {
      updates.push(`images = $${paramCount}`);
      values.push(images);
      paramCount++;
    }
    if (isFeatured !== undefined) {
      updates.push(`is_featured = $${paramCount}`);
      values.push(isFeatured);
      paramCount++;
    }
    if (isAvailable !== undefined) {
      updates.push(`is_available = $${paramCount}`);
      values.push(isAvailable);
      paramCount++;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.params.id);

    query += updates.join(', ') + ` WHERE id = $${paramCount}`;

    await pool.query(query, values);

    res.json({ success: true, message: 'Truck updated successfully' });
  } catch (error) {
    console.error('Update truck error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete truck (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM trucks WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Truck deleted successfully' });
  } catch (error) {
    console.error('Delete truck error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
