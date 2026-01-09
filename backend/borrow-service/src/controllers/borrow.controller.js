import * as BorrowModel from "../models/borrow.model.js";

export const createBorrow = async (req, res) => {
  try {
    const { cccd, name, phone, student_id, book_id, borrow_date, due_date, staff_id } = req.body;

    if (!cccd || !name || !book_id || !staff_id) {
      return res.status(400).json({ error: "Thiếu dữ liệu bắt buộc" });
    }

    let user = await BorrowModel.findUserByCCCD(cccd);
    let userId;
    if (!user) {
      userId = await BorrowModel.createUser({ name, phone, cccd, student_id });
    } else {
      userId = user.id;
    }

    await BorrowModel.createBorrow({
      user_id: userId,
      staff_id: Number(staff_id),
      book_id: Number(book_id),
      borrow_date,
      due_date
    });

    res.json({ message: "Mượn sách thành công" });
  } catch (err) {
    console.error("LỖI TẠO MƯỢN:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getBorrows = async (req, res) => {
  try {
    const data = await BorrowModel.getBorrows();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const returnBook = async (req, res) => {
  try {
    await BorrowModel.returnBook(req.params.id);
    res.json({ message: "Đã trả sách" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
