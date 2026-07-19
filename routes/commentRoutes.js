const express = require("express");
const commentRouter = express.Router();

const { addComment, getComment } = require("../controller/commentController");
const authenticateToken = require("../middleware/authentication");

commentRouter.post("/comments", authenticateToken, addComment);
commentRouter.get("/comments/:bookId", getComment);

module.exports = commentRouter;
