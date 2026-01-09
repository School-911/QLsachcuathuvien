import db from "./db.js";

export const getAllBooks = async () => {
  const [rows] = await db.query("SELECT * FROM books");
  return rows;
};

export const getBookById = async (id) => {
  const [rows] = await db.query("SELECT * FROM books WHERE id=?", [id]);
  return rows[0];
};

export const createBook = async (book) => {
  const {
    book_code,
    title,
    author,
    publisher,
    publish_year,
    quantity,
    image_url,
  } = book;

  const [result] = await db.query(
    `INSERT INTO books
     (book_code, title, author, publisher, publish_year, quantity, image_url)
     VALUES (?,?,?,?,?,?,?)`,
    [
      book_code,
      title,
      author,
      publisher,
      publish_year,
      quantity,
      image_url,
    ]
  );

  return result.insertId;
};


export const updateBook = (id, data) => {
  return db.query(
    `UPDATE books SET
      book_code = ?,
      title = ?,
      author = ?,
      publisher = ?,
      publish_year = ?,
      quantity = ?,
      image_url = ?
     WHERE id = ?`,
    [
      data.book_code,
      data.title,
      data.author,
      data.publisher,
      data.publish_year,
      data.quantity,
      data.image_url,
      id,
    ]
  );
};



export const deleteBook = async (id) => {
  return db.query("DELETE FROM books WHERE id=?", [id]);
};

export const searchBooks = async (q) => {
  const [rows] = await db.query(
    `SELECT * FROM books
     WHERE title LIKE ?
        OR book_code LIKE ?`,
    [`%${q}%`, `%${q}%`]
  );
  return rows;
};

