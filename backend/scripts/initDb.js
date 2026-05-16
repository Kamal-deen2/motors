const pool = require('../config/database');

async function initDatabase() {
  try {
    // Drop existing tables
    await pool.query(`DROP TABLE IF EXISTS order_items`);
    await pool.query(`DROP TABLE IF EXISTS orders`);
    await pool.query(`DROP TABLE IF EXISTS cart_items`);
    await pool.query(`DROP TABLE IF EXISTS carts`);
    await pool.query(`DROP TABLE IF EXISTS trucks`);
    await pool.query(`DROP TABLE IF EXISTS categories`);
    await pool.query(`DROP TABLE IF EXISTS users`);
    await pool.query(`DROP TABLE IF EXISTS contact_messages`);

    console.log('Dropped existing tables');

    // Create users table
    await pool.query(`
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'customer',
        is_verified INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create categories table
    await pool.query(`
      CREATE TABLE categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create trucks table
    await pool.query(`
      CREATE TABLE trucks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        category_id INTEGER REFERENCES categories(id),
        brand TEXT,
        model TEXT,
        year INTEGER,
        price REAL NOT NULL,
        condition TEXT,
        mileage INTEGER,
        engine TEXT,
        transmission TEXT,
        fuel_type TEXT,
        color TEXT,
        vin TEXT,
        images TEXT,
        is_featured INTEGER DEFAULT 0,
        is_available INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create carts table
    await pool.query(`
      CREATE TABLE carts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create cart_items table
    await pool.query(`
      CREATE TABLE cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cart_id INTEGER REFERENCES carts(id) ON DELETE CASCADE,
        truck_id INTEGER REFERENCES trucks(id),
        quantity INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create orders table
    await pool.query(`
      CREATE TABLE orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER REFERENCES users(id),
        order_number TEXT UNIQUE NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        payment_status TEXT DEFAULT 'pending',
        payment_method TEXT,
        billing_address TEXT,
        shipping_address TEXT,
        tracking_number TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create order_items table
    await pool.query(`
      CREATE TABLE order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        truck_id INTEGER REFERENCES trucks(id),
        truck_title TEXT,
        truck_price REAL,
        quantity INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create contact_messages table
    await pool.query(`
      CREATE TABLE contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT,
        message TEXT,
        is_read INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Created all tables successfully');

    // Insert sample categories
    await pool.query(`
      INSERT INTO categories (name, description) VALUES
      ('Semi Trucks', 'Heavy-duty semi trucks for commercial use'),
      ('Dump Trucks', 'Construction and dump trucks'),
      ('Pickup Trucks', 'Light and heavy pickup trucks'),
      ('Box Trucks', 'Box trucks for delivery and logistics'),
      ('Refrigerated Trucks', 'Temperature-controlled trucks'),
      ('Flatbed Trucks', 'Flatbed trucks for heavy hauling')
    `);

    console.log('Inserted sample categories');

    // Insert admin user (password: admin123)
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await pool.query(`
      INSERT INTO users (full_name, email, phone, password, role, is_verified, is_active)
      VALUES ('Admin User', 'admin@primemotors.com', '555-0100', ?, 'admin', 1, 1)
    `, [hashedPassword]);

    console.log('Inserted admin user');
    console.log('Database initialization complete!');

    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
