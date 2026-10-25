const pool = require("../config/db");

function bookController(pool) {
  const getBooks = async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM books ORDER BY id DESC");

      res.json({
        data: result.rows,
        status: "success",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: "failed",
      });
    }
  };

  const addBook = async (req, res) => {
    try {
      const { title, author, summary, category } = req.body || {};
      const image = req.file ? req.file.path : null;

      const result = await pool.query(
        `INSERT INTO books (title, author, image, summary, category)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [title, author, image, summary, category],
      );

      res.status(201).json({
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

  const updateBook = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, author, summary, category } = req.body;
      const image = req.file?.path || null;

      const result = await pool.query(
        `UPDATE books
         SET title = $1,
             author = $2,
             image = $3,
             summary = $4,
             category = $5
         WHERE id = $6
         RETURNING *`,
        [title, author, image, summary, category, id],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Book not found",
          status: "failed",
        });
      }

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

      const result = await pool.query(
        "DELETE FROM books WHERE id = $1 RETURNING *",
        [id],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Book not found",
          status: "failed",
        });
      }

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

  const incrementViews = async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `UPDATE books
         SET views = COALESCE(views, 0) + 1
         WHERE id = $1
         RETURNING *`,
        [id],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Book not found",
          status: "failed",
        });
      }

      res.json({
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
  const getSavedBooks = async (req, res) => {
    try {
      const userId = parse(req.params.userId);
      const result = await pool.query(
        `SELECT * FROM books where id In(SELECT book_id FROM saved_books WHERE user_id = #1)`,
        [userId],
      );

      res.json({
        data: result.rows,
        status: "success",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: "failed",
      });
    }
  };
  const toggleSaveBook = async (req, res) => {
    try {
      const userId = parseInt(req.body.userId);
      const bookId = parseInt(req.body.bookId);

      const checkResult = await pool.query(
        `SELECT * FROM saved_books WHERE users_id = $1 and book_id = $2`,
        [userId, bookId],
      );

      if (checkResult.rows.length === 0) {
        await pool.query(
          `INSERT INTO saved_books(user_id, book_id) VALUE($1,$2)`,
          [userId, bookId],
        );
        res.json({
          message: "Book saved successfully",
          status: "success",
        });
      } else {
        await pool.query(
          `DELETE FROM saved_books WHERE user_id = $1 AND book_id = $2`,
          [userId, bookId],
        );
        res.json({
          message: "Book unsaved successfully",
          status: "success",
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: "failed",
      });
    }
  };
  return {
    getBooks,
    addBook,
    updateBook,
    deleteBook,
    incrementViews,
    getSavedBooks,
    toggleSaveBook,
  };
}
module.exports = {
  bookController,
};
