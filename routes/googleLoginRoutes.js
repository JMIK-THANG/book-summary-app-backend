const express = require("express");
const googleLoginRouter = express.Router();

const googleLoginController = require("../controller/googleLoginController");

function googleLoginRoute(pool) { 

      googleLoginRouter.post("/", googleLoginController(pool).googleLogin);

      return googleLoginRouter; 
}


module.exports = googleLoginRoute;
