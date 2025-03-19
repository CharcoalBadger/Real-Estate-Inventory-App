const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Render
  },
});

async function seedDatabase() {
  console.log("🌱 Seeding Render Database:", process.env.DATABASE_URL);

  try {
    // Insert categories with RETURNING * to fetch IDs
    const categories = await pool.query(`
      INSERT INTO categories (name) VALUES 
      ('Apartment'), ('House'), ('Office'), ('Retail'), ('Studio'), ('Warehouse')
      ON CONFLICT (name) DO NOTHING 
      RETURNING id, name;
    `);

    // Fetch actual category IDs (in case they were inserted before)
    const categoriesMap = {};
    (await pool.query("SELECT * FROM categories")).rows.forEach((cat) => {
      categoriesMap[cat.name] = cat.id;
    });

    console.log("✅ Categories:", categoriesMap);

    // Insert properties using correct category_id values
    await pool.query(`
      INSERT INTO properties (title, description, price, location, category_id)
      VALUES 
      ('Modern Apartment', 'A sleek apartment with a great city view.', 1200, 'New York', ${categoriesMap["Apartment"]}),
      ('Suburban House', 'A spacious house with a backyard.', 1500, 'Los Angeles', ${categoriesMap["House"]}),
      ('Corporate Office Space', 'High-rise office in the business district.', 3500, 'San Francisco', ${categoriesMap["Office"]}),
      ('Downtown Retail Store', 'Perfect for a boutique or small shop.', 2500, 'Chicago', ${categoriesMap["Retail"]}),
      ('Studio Apartment', 'Ideal for single professionals.', 900, 'Boston', ${categoriesMap["Studio"]}),
      ('Warehouse Space', 'Large industrial space available for storage.', 5000, 'Houston', ${categoriesMap["Warehouse"]})
      ON CONFLICT DO NOTHING;
    `);

    console.log("✅ Dummy data inserted successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    pool.end();
  }
}

seedDatabase();
