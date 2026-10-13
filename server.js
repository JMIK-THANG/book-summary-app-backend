require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const commentRoutes = require("./routes/commentRoutes");
const googleLoginRoute = require("./routes/googleLoginRoutes");
const dashboardRoute = require("./routes/homeRoutes");
const shortReadRoutes = require("./routes/shortReadRoutes");

const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes(pool));
app.use("/books", bookRoutes(pool));
app.use("/comment", commentRoutes(pool));
app.use("/google-login", googleLoginRoute(pool));
app.use("/home", dashboardRoute(pool));
app.use("/short-reads", shortReadRoutes(pool));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
