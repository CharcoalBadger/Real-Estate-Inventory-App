const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "real_estate",
  port: process.env.DB_PORT || 5432,
});

async function seedDatabase() {
  console.log("Seeding database...");

  // Insert categories
  await pool.query(
    "INSERT INTO categories (name) VALUES ('Apartment'), ('House'), ('Office'), ('Retail')"
  );

  // Insert properties
  await pool.query(`
    INSERT INTO properties (title, description, price, location, category_id)
    VALUES 
    ('Luxury Apartment', 'Great view, 2 bedrooms.', 1200, 'New York', 1),
    ('Cozy House', '3 bedrooms, garden.', 1500, 'Los Angeles', 2),
    ('Office Space', 'Downtown office.', 2000, 'Chicago', 3);
  `);

  console.log("Database seeded!");
  process.exit();
}

seedDatabase();
