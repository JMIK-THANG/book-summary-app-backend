const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        status: "failed",
      });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE LOWER(TRIM(email)) = $1",
      [email],
    );
    if (existingUser.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid Email", status: "failed" });
    }
    const matchResult = await bcrypt.compare(
      password,
      existingUser.rows[0].password,
    );
    if (!matchResult) {
      return res
        .status(400)
        .json({ message: "Invalid Password", status: "failed" });
    }

    // Generate token
    const token = jwt.sign(
      {
        userId: existingUser.rows[0].id,
        role: existingUser.rows[0].role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.json({
      message: "Login successful",
      data: existingUser.rows[0],
      status: "success",
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      status: "failed",
    });
  }
};
const register = async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = req.body.email.trim().toLowerCase();

    //check if email already exists
    const existinguser = await pool.query(
      "SELECT * FROM users WHERE LOWER(TRIM(email)) = $1",
      [email],
    );

    if (existinguser.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Email is already registered", status: "failed" });
    }

    //change password to hash paswword
    const hashedpassword = await bcrypt.hash(password, 12);

    const result = await pool.query(
      "INSERT INTO users(name, role, password, email) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, "user", hashedpassword, email],
    );

    res.json({
      message: "User registered successfully",
      data: result.rows[0],
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "failed",
    });
  }
};

module.exports = { login, register };
