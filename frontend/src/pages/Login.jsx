import { useState } from "react";
import { loginApi } from "../services/auth.api";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginApi(form);

      // Lưu token + role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      alert("🎉 Đăng nhập thành công");
      // TODO: navigate sang dashboard sau
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Không kết nối được server"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* LEFT – FORM */}
        <div className="login-form-area">
          <div className="logo">
            <span className="logo-main">Libra</span>
            <span className="logo-sub">Byte</span>
          </div>

          <div className="form-header">
            <h2>Chào mừng trở lại 👋</h2>
            <p className="form-desc">
              Đăng nhập để tiếp tục quản lý thư viện của bạn
            </p>
          </div>

          <form onSubmit={submit}>
            <label>Tên đăng nhập</label>
            <input
              type="text"
              placeholder="Nhập tên đăng nhập"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />

            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            {error && <div className="error">{error}</div>}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </div>

        {/* RIGHT – IMAGE BACKGROUND */}
        <div className="login-illustration"></div>
      </div>
    </div>
  );
}
