const express = require("express");
const { dashboardController } = require("../controller/homeController");

const dashboardRouter = express.Router();

function dashboardRoute(pool) {
  dashboardRouter.get(
    "/dashboard-stats",
    dashboardController(pool).getDashboardStats,
  );

  return dashboardRouter;
}

module.exports = dashboardRoute;
