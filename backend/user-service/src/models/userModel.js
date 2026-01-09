import db from "./db.js";

export const getUsers = async () => {
  const [rows] = await db.query("SELECT * FROM users");
  return rows;
};

export const createUser = async (u) => {
  const [r] = await db.query(
    "INSERT INTO users(name,email,role) VALUES(?,?,?)",
    [u.name, u.email, u.role]
  );
  return r.insertId;
};

export const updateUser = async (id, u) => {
  const [r] = await db.query(
    "UPDATE users SET name=?, email=?, role=? WHERE id=?",
    [u.name, u.email, u.role, id]
  );
  return r;
};
