import "./BorrowDetailModal.css";

export default function BorrowDetailModal({ borrow, onClose }) {
  if (!borrow) return null;

  // Chỉ lấy ngày (YYYY-MM-DD) và chuyển sang DD/MM/YYYY
  const formatDate = (dateValue) => {
    if (!dateValue) return "-";
    let d = new Date(dateValue);
    if (isNaN(d)) return "-";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>

        <h3>Chi tiết lượt mượn</h3>

        <p><b>Người mượn:</b> {borrow.borrower_name}</p>
        <p><b>CCCD:</b> {borrow.cccd}</p>
        <p><b>SĐT:</b> {borrow.phone}</p>
        <p><b>Mã sách:</b> {borrow.book_id}</p>
        <p><b>Ngày mượn:</b> {formatDate(borrow.borrow_date)}</p>
        <p><b>Hạn trả:</b> {formatDate(borrow.due_date)}</p>
        <p><b>Trạng thái:</b> {borrow.status}</p>
      </div>
    </div>
  );
}
