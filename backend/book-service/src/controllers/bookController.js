import * as Book from "../models/bookModel.js";
import fs from "fs";
import path from "path";

export const getBooks = async (req, res) => {
  const data = await Book.getAllBooks();
  res.json(data);
};

export const createBook = async (req, res) => {
  const image_url = req.file
    ? `/uploads/${req.file.filename}`
    : req.body.image_url || "";

  const data = {
    book_code: req.body.book_code,
    title: req.body.title,
    author: req.body.author,
    publisher: req.body.publisher,
    publish_year: req.body.publish_year,
    quantity: req.body.quantity,
    image_url,
  };

  const id = await Book.createBook(data);
  res.json({ id });
};


export const updateBook = async (req, res) => {
  const oldBook = await Book.getBookById(req.params.id);

  const data = {
    book_code: req.body.book_code,
    title: req.body.title,
    author: req.body.author,
    publisher: req.body.publisher,
    publish_year: req.body.publish_year,
    quantity: req.body.quantity,
    image_url: oldBook.image_url,
  };

  await Book.updateBook(req.params.id, data);
  res.json({ message: "Updated" });
};


export const deleteBook = async (req, res) => {
  await Book.deleteBook(req.params.id);
  res.json({ message: "Deleted" });
};

export const searchBooks = async (req, res) => {
  const data = await Book.searchBooks(req.query.q);
  res.json(data);
};
