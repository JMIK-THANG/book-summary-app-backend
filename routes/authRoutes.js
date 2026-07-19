const express = require("express");
const authRouter = express.Router();

const { login, register } = require("../controller/authController");

const registerValidation = requrie("../backend/middleware/registerValidation");
const validateResult = require("../backend/middleware/validationResult");

authRouter.post("/login", login);
authRouter.post("/register", registerValidation, validateResult, register);

module.exports = authRouter;
