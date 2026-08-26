require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRouter = require("./routes/authRoutes");
const bookRouter = require("./routes/bookRoutes");
const commentRouter = require("./routes/commentRoutes");
const googleLoginRouter = require("./routes/googleLoginRoutes");
const homeRouter = require("./routes/homeRoutes");
const shortReadRouter = require("./routes/shortReadRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRouter);
app.use(bookRouter);
app.use(commentRouter);
app.use(googleLoginRouter);
app.use("/home", homeRouter);
app.use(shortReadRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
