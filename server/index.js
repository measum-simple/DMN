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
        defaultSrc: ["'self'", "blob:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "blob:"],
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
    console.error("DB connection failed:", err.message);
    process.exit(1);
  }
  console.log("Connected to MySQL");
});

// Get all products
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, results) => {
    if (err) {
      console.error("Error fetching products:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results.map((p) => ({ ...p, price: Number(p.price) })));
  });
});

// Add to cart
app.post("/cart", (req, res) => {
  const { product_id, name, price } = req.body;
  if (!product_id || !name || price === undefined) {
    return res.status(400).json({ error: "Missing product details!" });
  }

  db.query(
    "INSERT INTO cart (product_id, name, price, quantity) VALUES (?, ?, ?, 1) ON DUPLICATE KEY UPDATE quantity = quantity + 1",
    [product_id, name, parseFloat(price)],
    (err) => {
      if (err) {
        console.error("Error adding to cart:", err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Item added to cart!" });
    }
  );
});

// Get cart items
app.get("/cart", (req, res) => {
  db.query("SELECT * FROM cart", (err, stuff) => {
    if (err) {
      console.error("Error fetching cart:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(stuff);
  });
});

// Delete cart item
app.delete("/cart/:id", (req, res) => {
  db.query("DELETE FROM cart WHERE id = ?", [req.params.id], (err) => {
    if (err) {
      console.error("Error removing item:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Item removed from cart!" });
  });
});

// Default route
app.get("/", (req, res) => res.send("Welcome to the Departmental Store API!"));

// Start server
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
