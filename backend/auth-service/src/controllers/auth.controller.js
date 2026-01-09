import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findByUsername } from "../models/auth.model.js";

/**
 * POST /auth/login
 * Đăng nhập cho admin / quản lý
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Validate input
    if (!username || !password) {
      return res.status(400).json({
        message: "Thiếu tên đăng nhập hoặc mật khẩu"
      });
    }

    // 2. Tìm account
    const account = await findByUsername(username);
    if (!account) {
      return res.status(401).json({
        message: "Sai tên đăng nhập hoặc mật khẩu"
      });
    }

    // 3. Check password
    const isValid = await bcrypt.compare(password, account.password_hash);
    if (!isValid) {
      return res.status(401).json({
        message: "Sai tên đăng nhập hoặc mật khẩu"
      });
    }

    // 4. Tạo JWT
    const token = jwt.sign(
      {
        id: account.id,
        username: account.username,
        role: account.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. Trả kết quả
    return res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: account.id,
        username: account.username,
        role: account.role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      message: "Lỗi server"
    });
  }
};

/**
 * GET /auth/me
 * Lấy thông tin user từ token
 */
export const me = (req, res) => {
  return res.json(req.user);
};
