import express from "express";
import mysql from "mysql2";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'", "http://localhost:1000"],
        mediaSrc: ["'self'", "blob:"],
      },
    },
  })
);

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "department_store",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // Exit if DB connection fails
  }
  console.log("✅ Connected to MySQL");
});

// Fetch products
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) {
      console.error("❌ Error fetching products:", err.message);
      return res.status(500).json({ error: err.message });
    }

    // Ensure `price` is always returned as a number
    const formattedProducts = result.map((product) => ({
      ...product,
      price: Number(product.price), // Convert to number
    }));

    res.json(formattedProducts);
  });
});

// Add item to cart
app.post("/cart", (req, res) => {
  const { product_id, name, price } = req.body;
  if (!product_id || !name || price === undefined) {
    return res.status(400).json({ error: "Missing product details" });
  }

  db.query(
    "INSERT INTO cart (product_id, name, price, quantity) VALUES (?, ?, ?, 1) ON DUPLICATE KEY UPDATE quantity = quantity + 1",
    [product_id, name, parseFloat(price)], // Ensure price is stored as a number
    (err) => {
      if (err) {
        console.error("❌ Error adding to cart:", err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "✅ Item added to cart" });
    }
  );
});

// Fetch cart items
app.get("/cart", (req, res) => {
  db.query("SELECT * FROM cart", (err, result) => {
    if (err) {
      console.error("❌ Error fetching cart:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// Remove item from cart
app.delete("/cart/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM cart WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("❌ Error removing item from cart:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "🗑️ Item removed from cart" });
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("🏪 Welcome to the Departmental Store API!");
});

// Start server
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
