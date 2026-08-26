const express = require("express");
const authenticateToken = require("../middleware/authentication");
const {
  getShortReads,
  addShortRead,
  updateShortRead,
  deleteShortRead,
} = require("../controller/shortReadController");

const shortReadRouter = express.Router();

shortReadRouter.get("/short-reads", getShortReads);
shortReadRouter.post("/short-reads", authenticateToken, addShortRead);
shortReadRouter.put("/short-reads/:id", authenticateToken, updateShortRead);
shortReadRouter.delete("/short-reads/:id", authenticateToken, deleteShortRead);

module.exports = shortReadRouter;
