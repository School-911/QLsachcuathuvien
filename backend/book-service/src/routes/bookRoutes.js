import express from "express";
import { uploadImageSafe } from "../middlewares/uploadSafe.js";
import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,
} from "../controllers/bookController.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/search", searchBooks);
router.post("/", uploadImageSafe, createBook);
router.put("/:id", uploadImageSafe, updateBook);
router.delete("/:id", deleteBook);

export default router;
