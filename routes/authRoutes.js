const express = require("express");
const authRouter = express.Router();

const { login, register } = require("../controller/authController");

const registerValidation = require("../middleware/registerValidation");
const validateResult = require("../middleware/validationResult");

authRouter.post("/login", login);
authRouter.post("/register", registerValidation, validateResult, register);

module.exports = authRouter;
