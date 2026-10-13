const express = require("express");
const bookRouter = express.Router();

const { bookController } = require("../controller/bookController");

const authenticateToken = require("../middleware/authentication");
const upload = require("../middleware/upload");

function bookRoutes(pool) {
  bookRouter.get("/", bookController(pool).getBooks);
  bookRouter.post(
    "",
    authenticateToken,
    upload.single("image"),
    bookController(pool).addBook,
  );
  bookRouter.put(
    "/:id",
    authenticateToken,
    upload.single("image"),
    bookController(pool).updateBook,
  );
  bookRouter.delete("/:id", authenticateToken, bookController(pool).deleteBook);
  bookRouter.patch("/:id/view", bookController(pool).incrementViews);

  // No authentication required when a reader views a book
  bookRouter.get("/saved/:userId", bookController(pool).getSavedBooks);
  bookRouter.post("/saved", bookController(pool).toggleSaveBook);
  return bookRouter;
}

module.exports = bookRoutes;
