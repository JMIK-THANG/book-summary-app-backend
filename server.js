const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const authRouter = require("../backend/routes/authRoutes");
const bookRouter = require("../backend/routes/bookRoutes");
const commentRouter = require("../backend/routes/commentRoutes");
const googleLoginRouter = require("../backend/routes/googleLoginRoutes");

require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express();
app.use(cors());
app.use(express.json());

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "cabusim-books",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });
app.post("/upload", upload.single("pic"), async (req, res) => {
  const { name, age } = req.body;

  const imagePath = req.file ? req.file.path : null;

  res.json({
    message: "File uploaded successfully",
    textData: {
      name,
      age,
    },
    imageFile: {
      path: imagePath,
    },
  });
});
app.use(authRouter);
app.use(bookRouter);
app.use(commentRouter);
app.use(googleLoginRouter);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
