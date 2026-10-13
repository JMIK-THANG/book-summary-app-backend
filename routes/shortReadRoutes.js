const express = require("express");
const authenticateToken = require("../middleware/authentication");
const { shortReadController } = require("../controller/shortReadController");

const shortReadRouter = express.Router();

function shortReadRoutes(pool) {
  shortReadRouter.get("/short-reads", shortReadController(pool).getShortReads);
  shortReadRouter.post(
    "/",
    authenticateToken,
    shortReadController(pool).addShortRead,
  );
  shortReadRouter.put(
    "/:id",
    authenticateToken,
    shortReadController(pool).updateShortRead,
  );
  shortReadRouter.delete(
    "/:id",
    authenticateToken,
    shortReadController(pool).deleteShortRead,
  );
  return shortReadRouter;
}

module.exports = shortReadRoutes;
