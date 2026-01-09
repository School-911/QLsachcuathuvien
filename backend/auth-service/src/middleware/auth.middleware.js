import jwt from "jsonwebtoken";

/**
 * Middleware xác thực JWT
 * Gắn user vào req.user
 */
export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Chưa đăng nhập"
    });
  }

  const token = header.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "Token không hợp lệ"
      });
    }

    // decoded = { id, username, role, iat, exp }
    req.user = decoded;
    next();
  });
};
