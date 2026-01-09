import * as User from "../models/userModel.js";

export const getUsers = async (req, res) => {
  res.json(await User.getUsers());
};

export const createUser = async (req, res) => {
  const id = await User.createUser(req.body);
  res.json({ id });
};

export const updateUser = async (req, res) => {
  await User.updateUser(req.params.id, req.body);
  res.json({ message: "Updated" });
};
