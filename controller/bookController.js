const pool = require("../config/db");

const getBooks = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books ORDER BY id DESC");

    res.json({
      data: result.rows,
      status: "success",
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "failed" });
  }
};

const addBook = async (req, res) => {
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
};
const updateBook = async (req, res) => {
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
};
const deleteBook = async (req, res) => {
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
};
module.exports = { getBooks, addBook, updateBook, deleteBook };
