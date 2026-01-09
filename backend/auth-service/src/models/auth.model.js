import db from "../config/db.js";

export const findByUsername = async (username) => {
  const [rows] = await db.query(
    "SELECT * FROM accounts WHERE username = ?",
    [username]
  );
  return rows[0];
};
