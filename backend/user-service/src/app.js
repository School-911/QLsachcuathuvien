import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.listen(process.env.PORT, () => {
  console.log("👤 User Service running on port", process.env.PORT);
});
