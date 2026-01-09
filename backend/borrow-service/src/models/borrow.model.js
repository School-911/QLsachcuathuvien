import db from "../config/db.js";
import axios from "axios";

// Chuyển bất kỳ input Date/ISO string thành YYYY-MM-DD
const toMySQLDate = (input) => {
  if (!input) return null;
  const date = new Date(input);
  if (isNaN(date)) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Tìm user theo CCCD
export const findUserByCCCD = (cccd) =>
  new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE cccd = ?", [cccd], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });

// Tạo user mới
export const createUser = ({ name, phone, cccd, student_id }) =>
  new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO users (name, phone, cccd, student_id) VALUES (?, ?, ?, ?)",
      [name, phone, cccd, student_id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      }
    );
  });

// Tạo lượt mượn mới
export const createBorrow = async ({ user_id, staff_id, book_id, borrow_date, due_date }) => {
  if (!user_id || !book_id) throw new Error("user_id và book_id là bắt buộc");

  const borrowDateVal = toMySQLDate(borrow_date) || toMySQLDate(new Date());
  const dueDateVal = toMySQLDate(due_date) || toMySQLDate(new Date(Date.now() + 14*24*60*60*1000));

  const sql = `
    INSERT INTO borrows
    (user_id, staff_id, book_id, borrow_date, due_date, status)
    VALUES (?, ?, ?, ?, ?, 'BORROWING')
  `;
  return new Promise((resolve, reject) => {
    db.query(sql, [user_id, staff_id || null, book_id, borrowDateVal, dueDateVal], async (err, result) => {
      if (err) return reject(err);

      // Gọi API book-service giảm số lượng sách
      try {
        await axios.put(`http://localhost:5001/api/books/decrease/${book_id}`);
      } catch (e) {
        console.error("Lỗi giảm số lượng sách:", e.message);
      }

      resolve(result);
    });
  });
};

// Lấy danh sách lượt mượn
export const getBorrows = () =>
  new Promise((resolve, reject) => {
    const sql = `
      SELECT b.*, u.name AS borrower_name, u.phone, u.cccd, u.student_id
      FROM borrows b
      JOIN users u ON b.user_id = u.id
      ORDER BY b.id DESC
    `;
    db.query(sql, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });

// Trả sách
export const returnBook = async (id) =>
  new Promise((resolve, reject) => {
    // Lấy borrow trước
    db.query("SELECT * FROM borrows WHERE id = ?", [id], async (err, results) => {
      if (err) return reject(err);
      if (!results[0]) return reject(new Error("Borrow không tồn tại"));

      const borrow = results[0];

      if (borrow.status === "RETURNED") return resolve({ message: "Đã trả sách" });

      const sql = `
        UPDATE borrows 
        SET status = 'RETURNED', return_date = ?
        WHERE id = ?
      `;
      const today = toMySQLDate(new Date());

      db.query(sql, [today, id], async (err2, result) => {
        if (err2) return reject(err2);

        // Gọi API book-service cộng số lượng sách
        try {
          await axios.put(`http://localhost:5001/api/books/increase/${borrow.book_id}`);
        } catch (e) {
          console.error("Lỗi tăng số lượng sách:", e.message);
        }

        resolve(result);
      });
    });
  });
