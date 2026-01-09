import { useEffect, useState } from "react";
import { getBorrows, createBorrow, returnBook } from "../services/borrow.api.js";
import BorrowList from "../components/borrows/BorrowList.jsx";
import BorrowDetailModal from "../components/borrows/BorrowDetailModal.jsx";
import BorrowForm from "../components/borrows/BorrowForm.jsx";

export default function Borrow() {
  const [borrows, setBorrows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadBorrows = async () => {
    try {
      const res = await getBorrows();
      setBorrows(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách mượn:", err);
    }
  };

  useEffect(() => {
    loadBorrows();
  }, []);

  const showDetail = (borrow) => setSelected(borrow);

  const handleReturn = async (borrowId) => {
    if (!window.confirm("Xác nhận trả sách này?")) return;
    try {
      await returnBook(borrowId);
      // Cập nhật status ngay trên frontend
      setBorrows(prev =>
        prev.map(b => b.id === borrowId ? { ...b, status: "RETURNED" } : b)
      );
      alert("Trả sách thành công");
    } catch (err) {
      console.error("Lỗi trả sách:", err);
      alert("Trả sách thất bại");
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2>Mượn sách</h2>
        <button
          onClick={() => setShowForm(true)}
          style={{ padding: "8px 14px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}
        >
          + Tạo lượt mượn
        </button>
      </div>

      {showForm && (
        <BorrowForm
          onSuccess={loadBorrows}
          onClose={() => setShowForm(false)}
        />
      )}

      <BorrowList borrows={borrows} onDetail={showDetail} onReturn={handleReturn} />

      {selected && (
        <BorrowDetailModal
          borrow={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
