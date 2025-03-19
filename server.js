const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db/queries");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// 🏡 Home Route - Show All Properties
app.get("/", async (req, res) => {
  try {
    const properties = await db.getAllProperties(); // Fetch properties
    const categories = await db.getAllCategories(); // Fetch categories
    console.log("Properties fetched:", properties);
    console.log("Categories fetched:", categories);
    res.render("index", { properties, categories });
  } catch (error) {
    console.error("Error fetching properties or categories:", error);
    res.status(500).send("Internal Server Error");
  }
});

// ➕ New Property Form
app.get("/new", async (req, res) => {
  try {
    const categories = await db.getAllCategories();
    res.render("createProperty", { categories });
  } catch (error) {
    res.status(500).send("Error fetching categories.");
  }
});

// 🔍 View Properties by Category
app.get("/category/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;
    const properties = await db.getPropertiesByCategory(categoryId);
    const categories = await db.getAllCategories();
    res.render("index", { properties, categories });
  } catch (error) {
    res.status(500).send("Error fetching category properties.");
  }
});

// ✏️ Show Edit Form
app.get("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const properties = await db.getAllProperties();
    const property = properties.find((p) => p.id == id);
    const categories = await db.getAllCategories();
    res.render("editProperty", { property, categories });
  } catch (error) {
    res.status(500).send("Error loading edit page.");
  }
});

// 📝 Handle Edit Form Submission
app.post("/edit/:id", async (req, res) => {
  try {
    const { title, description, price, location, category_id } = req.body;
    await db.updateProperty(
      req.params.id,
      title,
      description,
      price,
      location,
      category_id
    );
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error updating property.");
  }
});

// ❌ Delete Property
app.post("/delete/:id", async (req, res) => {
  try {
    await db.deleteProperty(req.params.id);
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error deleting property.");
  }
});

// 🏠 Add Property (POST)
app.post("/new", async (req, res) => {
  try {
    const { title, description, price, location, category_id } = req.body;
    await db.insertProperty(title, description, price, location, category_id);
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error adding property.");
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
