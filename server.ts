import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { Pool } from "pg";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
app.post("/api/signup", async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)`,
      [full_name, email, passwordHash]
    );

    res.status(201).json({
      message: "Account created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
});
app.post("/api/signup", async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (full_name, email, password_hash)
       VALUES ($1, $2, $3)`,
      [full_name, email, passwordHash]
    );

    return res.status(201).json({
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});
app.get("/api/customers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM customers ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    console.error("Customers error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    console.error("Products error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/challans", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM challans ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    console.error("Challans error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/dashboard", async (req, res) => {
  try {
    const customers = await pool.query("SELECT COUNT(*) FROM customers");
    const challans = await pool.query("SELECT COUNT(*) FROM challans");

    res.json({
      total_customers: Number(customers.rows[0].count),
      total_challans: Number(challans.rows[0].count)
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.get("/", (req, res) => {
  res.json({
    message: "Fundsroom ERP CRM API is running",
  });
});

// SIGN UP

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});