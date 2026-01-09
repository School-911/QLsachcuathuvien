import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import borrowRoutes from "./routes/borrow.route.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/borrows", borrowRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Borrow Service running on port ${PORT}`);
});
