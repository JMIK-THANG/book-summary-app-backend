const express = require("express");
const authRouter = express.Router();
const registerValidation = require("../middleware/registerValidation");
const validateResult = require("../middleware/validationResult");

const authController= require("../controller/authController");

function authRoutes(pool) {
  authRouter.post("/login", authController(pool).login);
  authRouter.post(
    "/register",
    registerValidation,
    validateResult,
    authController(pool).register
  );
  return authRouter;
}

module.exports = authRoutes;
