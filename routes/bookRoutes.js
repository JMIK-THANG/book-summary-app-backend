express = require("express");
const bookRouter = express.Router();

const {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} = require("../controller/bookController");
const authenticateToken = require("../middleware/authentication");
const upload = require("../middleware/upload");

bookRouter.get("/books", getBooks);

bookRouter.post("/books", authenticateToken, upload.single("image"), addBook);
bookRouter.put("/books/:id", authenticateToken, updateBook);
bookRouter.delete("/books/:id", authenticateToken, deleteBook);

module.exports = bookRouter;
