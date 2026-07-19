const express = require("express");
const googleLoginRouter = express.Router();

const googleLogin = require("../controller/googleLoginController");

googleLoginRouter.post("/google-login", googleLogin);
