import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./Sidebar.css";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <div className={`sidebar ${open ? "open" : "closed"}`}>
      {/* TOP */}
      <div className="sidebar-top">
        <img src="https://i.pravatar.cc/100" className="avatar" />
        {open && (
          <div className="user-info">
            <b>Admin</b>
            <span>admin@library.com</span>
          </div>
        )}
      </div>

      {/* MENU */}
      <nav>
        <NavLink to="/" end>🏠 <span>Trang chủ</span></NavLink>
        <NavLink to="/books">📚 <span>Sách</span></NavLink>
        <NavLink to="/users">👤 <span>Người dùng</span></NavLink>
        <NavLink to="/stats">📊 <span>Thống kê</span></NavLink>
      </nav>

      <div className="logout">
        <button>🚪 <span>Đăng xuất</span></button>
      </div>

      {/* TOGGLE */}
      <div className="toggle" onClick={() => setOpen(!open)}>
        ☰
      </div>
    </div>
  );
}
