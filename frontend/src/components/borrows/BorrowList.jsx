import "./BorrowList.css";

export default function BorrowList({ borrows, onDetail, onReturn }) {
  return (
    <table className="borrow-table">
      <thead>
        <tr>
          <th>Người mượn</th>
          <th>Mã sách</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {borrows.map((b) => (
          <tr key={b.id}>
            <td>{b.borrower_name}</td>
            <td>{b.book_id}</td>
            <td>{b.status}</td>
            <td>
              <button className="detail-btn" onClick={() => onDetail(b)}>Chi tiết</button>
              {b.status === "BORROWING" && (
                <button className="return-btn" onClick={() => onReturn(b.id)}>Trả sách</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
