const pool = require("../config/db");

const addComment = async (req, res) => {
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
};

const getComment = async (req, res) => {
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
};

module.exports = { getComment, addComment };
