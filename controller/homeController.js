function dashboardController(pool) {
  const getDashboardStats = async (req, res) => {
    try {
      const booksCountQuery = pool.query("SELECT COUNT(*) FROM books");
      const usersCountQuery = pool.query("SELECT COUNT(*) FROM users");

      const [booksResult, usersResult] = await Promise.all([
        booksCountQuery,
        usersCountQuery,
      ]);

      return res.json({
        status: "success",
        data: {
          totalBooks: Number(booksResult.rows[0].count),
          totalUsers: Number(usersResult.rows[0].count),
        },
      });
    } catch (error) {
      console.error("Error fetching dashboard statistics:", error);

      return res.status(500).json({
        status: "failed",
        message: "Internal server error",
      });
    }
  };
  return { getDashboardStats };
}

module.exports = { dashboardController };
