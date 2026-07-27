const express = require("express");
const { getDashboardStats } = require("../controller/homeController");

const homeRouter = express.Router();

homeRouter.get("/dashboard-stats", getDashboardStats);

module.exports = homeRouter;