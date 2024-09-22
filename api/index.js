/* eslint-disable no-undef */
import express from "express";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import cookieParser from "cookie-parser";
import multer from "multer";
// import dbConnect from "./db.js";

// dbConnect();
const app = express();

app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "../client/public/upload");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + file.originalname);
	},
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), function (req, res) {
	const file = req.file;
	res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

const port = process.env.PORT || 8800;

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
