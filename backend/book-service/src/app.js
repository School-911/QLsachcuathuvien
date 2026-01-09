import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import bookRoutes from "./routes/bookRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));
app.use("/api/books", bookRoutes);

app.listen(process.env.PORT, () => {
  console.log(`📚 Book Service running on port ${process.env.PORT}`);
});
