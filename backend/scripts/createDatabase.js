const { Pool } = require('pg');

// Connect to PostgreSQL default database (postgres) to create a new database
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'postgres', // Default PostgreSQL password - user may need to change this
});

async function createDatabase() {
  try {
    console.log('Connecting to PostgreSQL...');
    await pool.connect();
    console.log('Connected successfully');

    console.log('Creating database prime_motors...');
    await pool.query('CREATE DATABASE prime_motors');
    console.log('Database created successfully!');

    await pool.end();
    process.exit(0);
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('Database prime_motors already exists');
      await pool.end();
      process.exit(0);
    } else {
      console.error('Error creating database:', error.message);
      console.error('\nMake sure:');
      console.error('1. PostgreSQL is running');
      console.error('2. The password in this script matches your PostgreSQL password');
      console.error('3. Edit this file and update the password if needed');
      await pool.end();
      process.exit(1);
    }
  }
}

createDatabase();
