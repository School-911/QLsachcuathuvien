import * as BookService from "../services/bookService.js";

export const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const data = await BookService.getAllBooks(page, limit);
    const total = await BookService.getBooksCount();

    res.json({
      data: data || [],
      page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const result = await BookService.createBook(req.body, req.file);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    const result = await BookService.updateBook(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const result = await BookService.deleteBook(req.params.id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const searchBooks = async (req, res) => {
  try {
    const data = await BookService.searchBooks(req.query.q);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
