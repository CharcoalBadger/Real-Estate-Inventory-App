const pool = require("./pool");

// Get all categories
async function getAllCategories() {
  const { rows } = await pool.query("SELECT * FROM categories");
  return rows;
}

// Get all properties (join categories)
async function getAllProperties() {
  const { rows } = await pool.query(`
    SELECT properties.*, categories.name AS category
    FROM properties
    JOIN categories ON properties.category_id = categories.id
  `);
  return rows;
}

// Insert new property
async function insertProperty(
  title,
  description,
  price,
  location,
  category_id
) {
  await pool.query(
    "INSERT INTO properties (title, description, price, location, category_id) VALUES ($1, $2, $3, $4, $5)",
    [title, description, price, location, category_id]
  );
}

// Get properties by category
async function getPropertiesByCategory(categoryId) {
  const { rows } = await pool.query(
    "SELECT * FROM properties WHERE category_id = $1",
    [categoryId]
  );
  return rows;
}

// Update a property
async function updateProperty(
  id,
  title,
  description,
  price,
  location,
  category_id
) {
  await pool.query(
    "UPDATE properties SET title=$1, description=$2, price=$3, location=$4, category_id=$5 WHERE id=$6",
    [title, description, price, location, category_id, id]
  );
}

// Delete a property
async function deleteProperty(id) {
  await pool.query("DELETE FROM properties WHERE id = $1", [id]);
}

module.exports = {
  getAllCategories,
  getAllProperties,
  insertProperty,
  getPropertiesByCategory,
  updateProperty,
  deleteProperty, // ✅ Make sure this is exported
};
