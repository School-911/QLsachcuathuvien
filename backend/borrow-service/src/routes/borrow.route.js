import express from "express";
import { createBorrow, getBorrows, returnBook } from "../controllers/borrow.controller.js";

const router = express.Router();

router.get("/", getBorrows);
router.post("/", createBorrow);
router.put("/return/:id", returnBook);

export default router;
