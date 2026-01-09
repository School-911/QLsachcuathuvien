import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 QUAN TRỌNG
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Auth service running 🚀");
});

app.listen(3001, () => {
  console.log("Auth service running on http://localhost:3001");
});
