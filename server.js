const express = require("express");
const cors = require("cors");
const pool = require("../backend/config/db");
const { OAuth2Client } = require("google-auth-library");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express();
app.use(cors());
app.use(express.json());

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "cabusim-books",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });
app.post("/upload", upload.single("pic"), async (req, res) => {
  const { name, age } = req.body;

  const imagePath = req.file ? req.file.path : null;

  res.json({
    message: "File uploaded successfully",
    textData: {
      name,
      age,
    },
    imageFile: {
      path: imagePath,
    },
  });
});

app.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    console.log(req.body);
    const result = await pool.query(
      "SELECT * FROM users WHERE name = $1 AND password = $2",
      [name, password],
    );

    if (result.rows.length === 0) {
      res.status(401).json({
        message: "Invalid credentials",
        status: "failed",
      });
    } else {
      res.json({
        message: "Login successful",
        data: result.rows[0],
        status: "success",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      status: "failed",
    });
  }
});
app.post("/register", async (req, res) => {
  try {
    const { name, password } = req.body;
    const role = "user";
    const result = await pool.query(
      "INSERT INTO users(name, role, password) VALUES ($1, $2, $3) RETURNING *",
      [name, role, password],
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
});
app.post("/comments", async (req, res) => {
  try {
    const { user_id, book_id, comment } = req.body;

    const result = await pool.query(
      "INSERT INTO comments (book_id, user_id, comment) VALUES ($1, $2, $3) RETURNING *",
      [book_id, user_id, comment],
    );

    res.json({
      message: "Comment added successfully",
      data: result.rows[0],
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "failed",
    });
  }
});

app.get("/comments/:bookId", async (req, res) => {
  try {
    const { bookId } = req.params;

    const result = await pool.query(
      `SELECT c.*, u.name 
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.book_id = $1
       ORDER BY c.created_at DESC`,
      [bookId],
    );

    res.json({
      data: result.rows,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "failed" });
  }
});
app.get("/books", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books ORDER BY id DESC");

    res.json({
      data: result.rows,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "failed" });
  }
});
app.post("/books", upload.single("image"), async (req, res) => {
  try {
    const { title, author, summary } = req.body || {};
    const image = req.file ? req.file.path : null;

    const result = await pool.query(
      "INSERT INTO books(title, author, image, summary) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, author, image, summary],
    );

    res.json({
      data: result.rows[0],
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "failed" });
  }
});
// app.post("/books", upload.single("image"), async (req, res) => {
//   try {
//     const { title, author, summary } = req.body;
//     const image = req.file ? req.file.path : null;

//     const result = await pool.query(
//       "INSERT INTO books(title,author,image,summary) VALUES ($1,$2,$3,$4) RETURNING *",
//       [title, author, image, summary],
//     );

//     if (result.rows.length === 0) {
//       res.status(500).json({ status: "failed" });
//     } else {
//       const bookWithImage = {
//         ...result.rows[0],
//         image: `http://localhost:5000/${result.rows[0].image}`,
//       };
//       res.json({data:bookWithImage, status: "success" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message, status: "failed" });
//   }
// });
app.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, image, summary } = req.body;

    const result = await pool.query(
      `UPDATE books
       SET title = $1, author = $2, image = $3, summary = $4
       WHERE id = $5
       RETURNING *`,
      [title, author, image, summary, id],
    );

    res.json({
      message: "Book updated successfully",
      status: "success",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "failed",
    });
  }
});
app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM books WHERE id = $1", [id]);

    res.json({
      message: "Book deleted successfully",
      status: "success",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      status: "failed",
    });
  }
});

app.post("/google-login", async (req, res) => {
  try {
    const { code } = req.body;

    const client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.SECRET_ID,
      process.env.DOMAIN,
    );

    const { tokens } = await client.getToken(code);

    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      },
    );

    const userInfo = await response.json();
    console.log(userInfo);

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      userInfo.email,
    ]);

    if (user.rows.length === 0) {
      const newUser = await pool.query(
        "INSERT INTO users(name, email, role) VALUES($1, $2, $3) RETURNING *",
        [userInfo.name, userInfo.email, "user"],
      );

      res.json({ user: newUser.rows[0] });
    } else {
      res.json({ user: user.rows[0] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
