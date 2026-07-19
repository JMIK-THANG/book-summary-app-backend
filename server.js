const express = require("express");
const cors = require("cors");

const authRouter = require("./routes/authRoutes");
const bookRouter = require("./routes/bookRoutes");
const commentRouter = require("./routes/commentRoutes");
const googleLoginRouter = require("./routes/googleLoginRoutes");

require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

app.use(authRouter);
app.use(bookRouter);
app.use(commentRouter);
app.use(googleLoginRouter);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
