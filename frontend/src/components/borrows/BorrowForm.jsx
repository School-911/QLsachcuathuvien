import { useState, useEffect } from "react";
import { createBorrow, getBorrows } from "../../services/borrow.api.js";
import "./BorrowForm.css";

export default function BorrowForm({ onSuccess, onClose }) {
  const todayISO = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const [form, setForm] = useState({
    cccd: "",
    name: "",
    phone: "",
    student_id: "",
    book_id: "",
    borrow_date: todayISO,
    due_date: "",
    staff_id: "",
  });

  const [errors, setErrors] = useState({});

  // Tự động điền thông tin nếu CCCD có trong database
  useEffect(() => {
    const fetchUser = async () => {
      if (form.cccd.length === 12) {
        try {
          const borrowsRes = await getBorrows();
          const user = borrowsRes.data.find((b) => b.cccd === form.cccd);
          if (user) {
            setForm((prev) => ({
              ...prev,
              name: user.borrower_name,
              phone: user.phone || "",
              student_id: user.student_id || "",
            }));
          }
        } catch (err) {
          console.error("Lỗi lấy user từ CCCD:", err);
        }
      }
    };
    fetchUser();
  }, [form.cccd]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "cccd" && value && !/^\d*$/.test(value)) return;
    if (name === "phone" && value && !/^\d*$/.test(value)) return;
    if (name === "name" && value && !/^[a-zA-Z\s]*$/.test(value)) return;
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const errs = {};
    if (!form.cccd || form.cccd.length !== 12) errs.cccd = "CCCD phải đủ 12 số";
    if (!form.name) errs.name = "Tên không được để trống";
    if (!form.phone || form.phone.length !== 10) errs.phone = "SĐT phải 10 số";
    if (!form.book_id) errs.book_id = "Mã sách không được để trống";
    if (!form.borrow_date) errs.borrow_date = "Ngày mượn không được để trống";
    if (form.borrow_date && form.borrow_date < todayISO)
      errs.borrow_date = "Ngày mượn phải từ hôm nay trở đi";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      book_id: Number(form.book_id),
      staff_id: Number(form.staff_id),
      borrow_date: form.borrow_date,
      due_date: form.due_date || undefined,
    };

    try {
      await createBorrow(payload);
      setForm({
        cccd: "",
        name: "",
        phone: "",
        student_id: "",
        book_id: "",
        borrow_date: todayISO,
        due_date: "",
        staff_id: "",
      });
      setErrors({});
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Lỗi tạo lượt mượn:", err);
      alert("Tạo lượt mượn thất bại!");
    }
  };

  return (
    <div className="borrow-overlay">
      <div className="borrow-modal">
        <button className="borrow-close-btn" onClick={onClose}>×</button>
        <h3>Mượn sách</h3>
        <form onSubmit={handleSubmit} className="borrow-form-inner">
          <input name="cccd" type="text" placeholder="CCCD (12 số)" value={form.cccd} onChange={handleChange} maxLength={12} required/>
          {errors.cccd && <p className="error">{errors.cccd}</p>}

          <input name="name" type="text" placeholder="Họ và tên" value={form.name} onChange={handleChange} required/>
          {errors.name && <p className="error">{errors.name}</p>}

          <input name="phone" type="text" placeholder="SĐT (10 số)" value={form.phone} onChange={handleChange} maxLength={10} required/>
          {errors.phone && <p className="error">{errors.phone}</p>}

          <input name="student_id" type="text" placeholder="Mã SV (nếu có)" value={form.student_id} onChange={handleChange} />

          <input name="book_id" type="number" placeholder="Mã sách" value={form.book_id} onChange={handleChange} required/>
          {errors.book_id && <p className="error">{errors.book_id}</p>}

          <label>
            Ngày mượn:
            <input name="borrow_date" type="date" value={form.borrow_date} onChange={handleChange} min={todayISO} required/>
          </label>
          {errors.borrow_date && <p className="error">{errors.borrow_date}</p>}

          <label>
            Hạn trả:
            <input name="due_date" type="date" value={form.due_date} onChange={handleChange} min={form.borrow_date}/>
          </label>

          <input name="staff_id" type="number" placeholder="ID nhân viên" value={form.staff_id} onChange={handleChange} required/>

          <button type="submit">Lưu</button>
        </form>
      </div>
    </div>
  );
}
