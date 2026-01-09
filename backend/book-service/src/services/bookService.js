import * as BookRepo from "../models/bookModel.js";

export const createBook = async (payload, file) => {
  const requiredFields = ["book_code", "title", "author", "publisher", "publish_year", "quantity"];
  for (const field of requiredFields) {
    if (!payload[field]) throw new Error(`Field "${field}" is required`);
  }

  const publish_year = Number(payload.publish_year);
  const quantity = Number(payload.quantity);

  if (isNaN(publish_year) || isNaN(quantity) || quantity < 0) 
    throw new Error("publish_year and quantity must be valid numbers");

  // Check duplicate code
  const existingBooks = await BookRepo.searchBooks(payload.book_code);
  if (existingBooks.some(b => b.book_code === payload.book_code))
    throw new Error(`Book code "${payload.book_code}" already exists`);

  const image_url = file ? `/uploads/${file.filename}` : payload.image_url || "";

  const data = {
    book_code: payload.book_code,
    title: payload.title,
    author: payload.author,
    publisher: payload.publisher,
    publish_year,
    quantity,
    image_url
  };

  const id = await BookRepo.createBook(data);

  return {
    success: true,
    message: `Book "${payload.title}" created successfully`,
    id
  };
};

export const updateBook = async (id, payload) => {
  const oldBook = await BookRepo.getBookById(id);
  if (!oldBook) throw new Error("Book not found");

  if (payload.book_code && payload.book_code !== oldBook.book_code) {
    const existingBooks = await BookRepo.searchBooks(payload.book_code);
    if (existingBooks.some(b => b.book_code === payload.book_code))
      throw new Error(`Book code "${payload.book_code}" already exists`);
  }

  const publish_year = Number(payload.publish_year);
  const quantity = Number(payload.quantity);

  if (isNaN(publish_year) || isNaN(quantity) || quantity < 0) 
    throw new Error("publish_year and quantity must be valid numbers");

  const data = {
    book_code: payload.book_code,
    title: payload.title,
    author: payload.author,
    publisher: payload.publisher,
    publish_year,
    quantity,
    image_url: oldBook.image_url 
  };

  await BookRepo.updateBook(id, data);

  return { success: true, message: `Book "${payload.title}" updated successfully` };
};

export const deleteBook = async (id) => {
  const book = await BookRepo.getBookById(id);
  if (!book) throw new Error("Book not found");

  await BookRepo.deleteBook(id);

  return { success: true, message: `Book "${book.title}" deleted successfully` };
};

export const searchBooks = async (q) => {
  return await BookRepo.searchBooks(q);
};

export const getAllBooks = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const sql = `SELECT * FROM books ORDER BY id DESC LIMIT ? OFFSET ?`;
  const [rows] = await db.execute(sql, [limit, offset]);
  return rows;
};
export const getBooksCount = async () => {
  const [rows] = await db.execute(`SELECT COUNT(*) as count FROM books`);
  return rows[0].count;
};
