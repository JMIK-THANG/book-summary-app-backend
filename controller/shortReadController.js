const pool = require("../config/db");

function shortReadController(pool) {
  const ensureShortReadsTable = async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS short_reads (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255),
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
  };

  const getShortReads = async (req, res) => {
    try {
      await ensureShortReadsTable();

      const result = await pool.query(
        "SELECT * FROM short_reads ORDER BY created_at DESC, id DESC",
      );

      res.json({ data: result.rows, status: "success" });
    } catch (error) {
      res.status(500).json({ message: error.message, status: "failed" });
    }
  };

  const addShortRead = async (req, res) => {
    try {
      const title = req.body?.title?.trim();
      const author = req.body?.author?.trim() || null;
      const content = req.body?.content?.trim();

      if (!title || !content) {
        return res.status(400).json({
          message: "Title and content are required.",
          status: "failed",
        });
      }

      await ensureShortReadsTable();

      const result = await pool.query(
        `INSERT INTO short_reads (title, author, content)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [title, author, content],
      );

      res.status(201).json({ data: result.rows[0], status: "success" });
    } catch (error) {
      res.status(500).json({ message: error.message, status: "failed" });
    }
  };

  const updateShortRead = async (req, res) => {
    try {
      const { id } = req.params;
      const title = req.body?.title?.trim();
      const author = req.body?.author?.trim() || null;
      const content = req.body?.content?.trim();

      if (!title || !content) {
        return res.status(400).json({
          message: "Title and content are required.",
          status: "failed",
        });
      }

      await ensureShortReadsTable();

      const result = await pool.query(
        `UPDATE short_reads
         SET title = $1, author = $2, content = $3, updated_at = NOW()
         WHERE id = $4
         RETURNING *`,
        [title, author, content, id],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Short Read not found.",
          status: "failed",
        });
      }

      res.json({
        data: result.rows[0],
        message: "Short Read updated successfully.",
        status: "success",
      });
    } catch (error) {
      res.status(500).json({ message: error.message, status: "failed" });
    }
  };

  const deleteShortRead = async (req, res) => {
    try {
      await ensureShortReadsTable();

      const result = await pool.query(
        "DELETE FROM short_reads WHERE id = $1 RETURNING id",
        [req.params.id],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Short Read not found.",
          status: "failed",
        });
      }

      res.json({
        message: "Short Read deleted successfully.",
        status: "success",
      });
    } catch (error) {
      res.status(500).json({ message: error.message, status: "failed" });
    }
  };
  return {
    ensureShortReadsTable,
    getShortReads,
    addShortRead,
    updateShortRead,
    deleteShortRead,
  };
}

module.exports = {
  shortReadController,
};
