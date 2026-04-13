const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || 'user',
  password: process.env.PGPASSWORD || 'password',
  database: process.env.PGDATABASE || 'productsdb',
});

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price NUMERIC NOT NULL
      );
    `);
    
    // Insert sample items if table is empty
    const { rows } = await pool.query('SELECT COUNT(*) FROM items');
    if (parseInt(rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO items (name, price) VALUES 
        ('Sample Product 1', 19.99),
        ('Sample Product 2', 29.99)
      `);
      console.log('Inserted memory items to PostgreSQL');
    }
    
    console.log('Connected to PostgreSQL and verified items table');
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
};

module.exports = {
  pool,
  initDb,
};
