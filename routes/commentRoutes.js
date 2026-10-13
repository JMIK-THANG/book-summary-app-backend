const express = require("express");
const commentRouter = express.Router();

const { commentController } = require("../controller/commentController");
const authenticateToken = require("../middleware/authentication");

function commentRoutes(pool) {
  commentRouter.post(
    "/",
    authenticateToken,
    commentController(pool).addComment,
  );
  commentRouter.get("/:bookId", commentController(pool).getComment);
  return commentRouter; 
}

module.exports = commentRoutes;
