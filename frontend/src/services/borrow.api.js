import axios from "axios";

const API_URL = "http://localhost:5000/api/borrows";

export const getBorrows = () => axios.get(API_URL);

export const createBorrow = (data) => {
  // Tính borrow_date và due_date nếu chưa có
  const today = new Date();
  const borrowDate = data.borrow_date
    ? new Date(data.borrow_date)
    : today;
  const dueDate = data.due_date
    ? new Date(data.due_date)
    : new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);

  return axios.post(API_URL, {
    name: data.name,
    phone: data.phone,
    cccd: data.cccd,
    student_id: data.student_id || null,
    book_id: data.book_id,
    borrow_date: borrowDate.toISOString(),
    due_date: dueDate.toISOString(),
    staff_id: data.staff_id || null,
  });
};

export const returnBook = (id) =>
  axios.put(`${API_URL}/return/${id}`);
